"use client";

import {
  Select,
  createListCollection,
  Box,
  Text,
} from "@chakra-ui/react";

interface AlertStatusSelectProps {
  defaultValue: string;
  name: string;
}

const alertTypes = createListCollection({
  items: [
    { label: "PROCESSING", value: "PROCESSING" },
    { label: "RESOLVED", value: "RESOLVED" },
    { label: "IGNORED", value: "IGNORED" },
  ],
});

export default function AlertStatusSelect({ defaultValue, name }: AlertStatusSelectProps) {
  return (
    <Box>
      <Text fontSize="sm" color="gray.500" mb={2}>
        Status
      </Text>
      <Select.Root
        collection={alertTypes}
        name={name}
        defaultValue={[defaultValue]}
        size="md"
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select operation type" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {alertTypes.items.map((type) => (
              <Select.Item item={type} key={type.value}>
                <Select.ItemText>{type.label}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </Box>
  );
}