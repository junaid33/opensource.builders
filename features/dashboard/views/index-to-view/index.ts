#!/usr/bin/env node
/**
 * Index-to-view generator that creates getFieldTypeFromViewsIndex.ts
 * This replaces the old index-to-view.ts approach with the working generate-field-views logic
 */

import { main } from "./generate-field-views";

// Execute the generation when this script is run
main();