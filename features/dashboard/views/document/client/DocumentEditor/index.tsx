import { type KeyboardEvent, type ReactNode, useContext, useState } from 'react'
// @ts-ignore
import isHotkey from 'is-hotkey'
import { useCallback, useMemo } from 'react'
import {
  type Descendant,
  type NodeEntry,
  type Range,
  Editor,
  Node,
  Transforms,
  Element,
  Text,
} from 'slate'
import { Editable, ReactEditor, Slate, withReact, useSlate } from 'slate-react'

import type { EditableProps } from 'slate-react/dist/components/editable'
import type { ComponentBlock } from '../component-blocks'
import type { DocumentFeatures } from '../views-shared'
import { wrapLink } from './link-shared'
import { clearFormatting, type Mark } from './utils'
import { Toolbar } from './Toolbar'
import { renderElement } from './render-element'
import { nestList, unnestList } from './lists-shared'
import { ComponentBlockContext } from './component-blocks'
import { getPlaceholderTextForPropPath } from './component-blocks/utils'
import type { Relationships } from './relationship'
import { renderLeaf } from './leaf'
import { ToolbarStateProvider } from './toolbar-state'

import { createDocumentEditor } from './editor-shared'
import { ActiveBlockPopoverProvider } from './primitives/BlockPopover'

import { cn } from "@/lib/utils"

const styles = {
  flex: 1,
  'ol ol ol ol ol ol ol ol ol': { listStyle: 'lower-roman' },
  'ol ol ol ol ol ol ol ol': { listStyle: 'lower-alpha' },
  'ol ol ol ol ol ol ol': { listStyle: 'decimal' },
  'ol ol ol ol ol ol': { listStyle: 'lower-roman' },
  'ol ol ol ol ol': { listStyle: 'lower-alpha' },
  'ol ol ol ol': { listStyle: 'decimal' },
  'ol ol ol': { listStyle: 'lower-roman' },
  'ol ol': { listStyle: 'lower-alpha' },
  'ol': { listStyle: 'decimal' },
  'ul ul ul ul ul ul ul ul ul': { listStyle: 'square' },
  'ul ul ul ul ul ul ul ul': { listStyle: 'circle' },
  'ul ul ul ul ul ul ul': { listStyle: 'disc' },
  'ul ul ul ul ul ul': { listStyle: 'square' },
  'ul ul ul ul ul': { listStyle: 'circle' },
  'ul ul ul ul': { listStyle: 'disc' },
  'ul ul ul': { listStyle: 'square' },
  'ul ul': { listStyle: 'circle' },
  'ul': { listStyle: 'disc' }
}

const HOTKEYS: Record<string, Mark> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
}

function isMarkActive(editor: Editor, mark: Mark) {
  const marks = Editor.marks(editor)
  if (marks?.[mark]) {
    return true
  }
  // see the stuff about marks in toolbar-state for why this is here
  for (const entry of Editor.nodes(editor, { match: Text.isText })) {
    if (entry[0][mark]) {
      return true
    }
  }
  return false
}

const getKeyDownHandler = (editor: Editor) => (event: KeyboardEvent) => {
  if (event.defaultPrevented) return
  for (const hotkey in HOTKEYS) {
    if (isHotkey(hotkey, event.nativeEvent)) {
      event.preventDefault()
      const mark = HOTKEYS[hotkey]
      const isActive = isMarkActive(editor, mark)
      if (isActive) {
        Editor.removeMark(editor, mark)
      } else {
        Editor.addMark(editor, mark, true)
      }
      return
    }
  }
  if (isHotkey('mod+\\', event.nativeEvent)) {
    clearFormatting(editor)
    return
  }
  if (isHotkey('mod+k', event.nativeEvent)) {
    event.preventDefault()
    wrapLink(editor, '')
    return
  }
  if (event.key === 'Tab') {
    const didAction = event.shiftKey ? unnestList(editor) : nestList(editor)
    if (didAction) {
      event.preventDefault()
      return
    }
  }
  if (event.key === 'Tab' && editor.selection) {
    const layoutArea = Editor.above(editor, {
      match: node => node.type === 'layout-area',
    })
    if (layoutArea) {
      const layoutAreaToEnter = event.shiftKey
        ? Editor.before(editor, layoutArea[1], { unit: 'block' })
        : Editor.after(editor, layoutArea[1], { unit: 'block' })
      Transforms.setSelection(editor, { anchor: layoutAreaToEnter, focus: layoutAreaToEnter })
      event.preventDefault()
    }
  }
}

export function DocumentEditor({
  onChange,
  value,
  componentBlocks,
  relationships,
  documentFeatures,
  initialExpanded = false,
  ...props
}: {
  onChange: undefined | ((value: Descendant[]) => void)
  value: Descendant[]
  componentBlocks: Record<string, ComponentBlock>
  relationships: Relationships
  documentFeatures: DocumentFeatures
  initialExpanded?: boolean
} & Omit<EditableProps, 'value' | 'onChange'>) {
  const [expanded, setExpanded] = useState(initialExpanded)
  const editor = useMemo(
    () =>
      createDocumentEditor(documentFeatures, componentBlocks, relationships, {
        ReactEditor,
        withReact,
      }),
    [documentFeatures, componentBlocks, relationships]
  )

  return (
    <div>
      <DocumentEditorProvider
        componentBlocks={componentBlocks}
        documentFeatures={documentFeatures}
        relationships={relationships}
        editor={editor}
        value={value}
        onChange={value => {
          onChange?.(value)
          // this fixes a strange issue in Safari where the selection stays inside of the editor
          // after a blur event happens but the selection is still in the editor
          // so the cursor is visually in the wrong place and it inserts text backwards
          const selection = window.getSelection()
          if (selection && !ReactEditor.isFocused(editor)) {
            const editorNode = ReactEditor.toDOMNode(editor, editor)
            if (selection.anchorNode === editorNode) {
              ReactEditor.focus(editor)
            }
          }
        }}>
        {useMemo(() =>
          onChange !== undefined && (
            <Toolbar
              documentFeatures={documentFeatures}
              viewState={{
                expanded,
                toggle: () => {
                  setExpanded(v => !v)
                },
              }} />
          ), [expanded, documentFeatures, onChange])}

        <DocumentEditorEditable
          className={cn(
            "focus-visible:outline-none rounded-inherit bg-background border-border",
            "px-4 py-3 min-h-[120px] scrollbar-gutter-stable",
            expanded ? "h-auto !important" : "h-56 resize-y",
            "overflow-y-auto"
          )}
          {...props}
          readOnly={onChange === undefined} />
      </DocumentEditorProvider>
    </div>
  )
}

export function DocumentEditorProvider({
  children,
  editor,
  onChange,
  value,
  componentBlocks,
  documentFeatures,
  relationships,
}: {
  children: ReactNode
  value: Descendant[]
  onChange: (value: Descendant[]) => void
  editor: Editor
  componentBlocks: Record<string, ComponentBlock>
  relationships: Relationships
  documentFeatures: DocumentFeatures
}) {
  const identity = useMemo(() => Math.random().toString(36), [editor])

  // Ensure value is valid before passing to Slate
  const safeValue = useMemo(() => {
    if (!Array.isArray(value) || value.length === 0) {
      return [{ type: 'paragraph', children: [{ text: '' }] }] as Descendant[]
    }
    return value
  }, [value])

  return (
    <Slate
      // this fixes issues with Slate crashing when a fast refresh occcurs
      key={identity}
      editor={editor}
      initialValue={safeValue}
      onChange={value => {
        onChange(value)
        // this fixes a strange issue in Safari where the selection stays inside of the editor
        // after a blur event happens but the selection is still in the editor
        // so the cursor is visually in the wrong place and it inserts text backwards
        const selection = window.getSelection()
        if (selection && !ReactEditor.isFocused(editor)) {
          const editorNode = ReactEditor.toDOMNode(editor, editor)
          if (selection.anchorNode === editorNode) {
            ReactEditor.focus(editor)
          }
        }
      }}
    >
      <ToolbarStateProvider
        componentBlocks={componentBlocks}
        editorDocumentFeatures={documentFeatures}
        relationships={relationships}
      >
        {children}
      </ToolbarStateProvider>
    </Slate>
  )
}

export function DocumentEditorEditable(props: EditableProps) {
  const editor = useSlate()
  const componentBlocks = useContext(ComponentBlockContext)
  const onKeyDown = useMemo(() => getKeyDownHandler(editor), [editor])

  return (
    <ActiveBlockPopoverProvider editor={editor}>
      <Editable
        decorate={useCallback(
          ([node, path]: NodeEntry<Node>) => {
            const decorations: Range[] = []
            if (node.type === 'component-block') {
              if (
                node.children.length === 1 &&
                Element.isElement(node.children[0]) &&
                node.children[0].type === 'component-inline-prop' &&
                node.children[0].propPath === undefined
              ) {
                return decorations
              }
              node.children.forEach((child, index) => {
                if (
                  Node.string(child) === '' &&
                  Element.isElement(child) &&
                  (child.type === 'component-block-prop' ||
                    child.type === 'component-inline-prop') &&
                  child.propPath !== undefined
                ) {
                  const start = Editor.start(editor, [...path, index])
                  const placeholder = getPlaceholderTextForPropPath(
                    child.propPath,
                    componentBlocks[node.component].schema,
                    node.props
                  )
                  if (placeholder) {
                    decorations.push({
                      placeholder,
                      anchor: start,
                      focus: start,
                    })
                  }
                }
              })
            }
            return decorations
          },
          [editor, componentBlocks]
        )}
        onKeyDown={onKeyDown}
        renderElement={renderElement}
        renderLeaf={(props) => {
          // Add safety wrapper around renderLeaf
          try {
            return renderLeaf(props)
          } catch (error) {
            console.error('Error in renderLeaf:', error, props)
            // Return safe fallback
            return <span {...props.attributes}>{props.text?.text || ''}</span>
          }
        }}
        {...props}
      />
    </ActiveBlockPopoverProvider>
  )
}

/*
function Debugger () {
  const editor = useSlate()
  return (
    <pre>
      {JSON.stringify(
        {
          selection:
            editor.selection && Range.isCollapsed(editor.selection)
              ? editor.selection.anchor
              : editor.selection,
          marksWithoutCall: editor.marks,
          marks: Editor.marks(editor),
          children: editor.children,
        },
        null,
        2
      )}
    </pre>
  )
}
*/
