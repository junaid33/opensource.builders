import { useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useList } from "@/features/dashboard/hooks/useAdminMeta"; // Assuming useAdminMeta is the correct path
import { useCreateItem } from "@/features/dashboard/hooks/useCreateItem";
import { GraphQLErrorNotice } from "@/features/dashboard/components/GraphQLErrorNotice";
import type { List } from '@/features/dashboard/types'; // Import the List type
import type { FieldMeta } from '@/features/dashboard/types'; // Assuming path
import { Fields } from "@/features/dashboard/components/Fields";

interface CreateItemDrawerProps {
  listKey: string;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  trigger: React.ReactNode;
  onClose: () => void;
  onCreate: (item: { id: string; label: string }) => void;
}

interface CreateItemDrawerInnerProps {
  enhancedList: List; // Use the imported List type
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  onClose: () => void;
  onCreate: (item: { id: string; label: string }) => void;
}

// Inner component that calls the hook unconditionally
function CreateItemDrawerInner({
  enhancedList,
  isDrawerOpen,
  setIsDrawerOpen,
  onClose,
  onCreate,
}: CreateItemDrawerInnerProps) {
  // Hook is now called unconditionally within this component's lifecycle
  const createItemState = useCreateItem(enhancedList);

  const handleSubmit = useCallback(async () => {
    try {
      const item = await createItemState.create();
      if (item) {
        onCreate({
          id: item.id,
          label: item[enhancedList.labelField] || item.id,
        });
        // Optionally close drawer on success
        // setIsDrawerOpen(false);
        // onClose();
      }
    } catch (err) {
      // Error state is managed by useCreateItem and displayed by GraphQLErrorNotice
      console.error("Failed to create item:", err); // Keep for debugging if needed
    }
  }, [enhancedList, createItemState, onCreate /*, setIsDrawerOpen, onClose */]);

  const handleClose = useCallback(() => {
    // Removed createItemState.reset() as it doesn't exist on the hook
    onClose();
    setIsDrawerOpen(false);
  }, [onClose, setIsDrawerOpen]);

  return (
    // DrawerContent is rendered by the outer component now
    <>
      <DrawerHeader>
        <DrawerTitle>Create {enhancedList.singular}</DrawerTitle>
      </DrawerHeader>

      <DrawerBody className="py-2">
        {createItemState.error && (
          <GraphQLErrorNotice
            networkError={createItemState.error.networkError}
            errors={createItemState.error.graphQLErrors}
          />
        )}
        {/* Pass the props returned by the hook to Fields, asserting the correct type for fields */}
        <Fields {...createItemState.props as { fields: Record<string, FieldMeta> } & Omit<typeof createItemState.props, 'fields'>} />
      </DrawerBody>

      <DrawerFooter>
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            createItemState.state === "loading" ||
            // Safely check invalidFields before accessing size
            (createItemState.invalidFields && createItemState.invalidFields.size > 0)
          }
        >
          {createItemState.state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create"
          )}
        </Button>
      </DrawerFooter>
    </>
  );
}

// Outer component handles loading and conditionally renders the Inner component
export function CreateItemDrawer({
  listKey,
  isDrawerOpen,
  setIsDrawerOpen,
  trigger,
  onClose,
  onCreate,
}: CreateItemDrawerProps) {
  const { list, isLoading } = useList(listKey);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        {/* Wrap trigger in a div to ensure it's a single child */}
        <div>{trigger}</div>
      </DrawerTrigger>
      <DrawerContent>
        {isLoading || !list ? (
          // Display loading indicator inside the drawer content area
          <div className="flex items-center justify-center h-64"> {/* Added fixed height */}
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          // Render the inner component when data is ready
          <CreateItemDrawerInner
            enhancedList={list}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            onClose={onClose}
            onCreate={onCreate}
          />
          // <>
          // {JSON.stringify({list})}
          // </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
