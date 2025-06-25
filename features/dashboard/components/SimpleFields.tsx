"use client";

import React from "react";

interface SimpleFieldsProps {
  fields: string[];
}

export function SimpleFields({ fields }: SimpleFieldsProps) {
  return (
    <div className="grid w-full items-center gap-4">
      {fields.map((field) => (
        <div key={field} className="flex flex-col gap-1.5">
          <label htmlFor={field} className="text-sm font-medium">
            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            id={field}
            name={field}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      ))}
    </div>
  );
}
