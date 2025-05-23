"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  createListCollection,
  Field,
  Flex,
  IconButton,
  Input,
  InputGroup,
  Portal,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { LuSearch, LuX, LuFilter } from "react-icons/lu";

interface SearchFormProps {
  initialValues?: {
    keyword?: string;
    location?: string;
    minAmount?: string;
    maxAmount?: string;
    sortBy?: string;
    sortDirection?: string;
  };
}

interface FormValues {
  keyword: string;
  location: string;
  minAmount: string;
  maxAmount: string;
  sortBy: string;
  sortDirection: string;
}

const defaultValues: FormValues = {
  keyword: "",
  location: "",
  minAmount: "",
  maxAmount: "",
  sortBy: "",
  sortDirection: "ASC",
};

const SearchForm = ({ initialValues }: SearchFormProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync form values with URL params on mount and when searchParams change
  useEffect(() => {
    const urlValues: FormValues = {
      keyword: searchParams.get("keyword") || "",
      location: searchParams.get("location") || "",
      minAmount: searchParams.get("minAmount") || "",
      maxAmount: searchParams.get("maxAmount") || "",
      sortBy: searchParams.get("sortBy") || "",
      sortDirection: searchParams.get("sortDirection") || "ASC",
    };
    
    setFormValues(urlValues);
  }, [searchParams]);

  // Create new searchParams from formValues
  const createQueryString = useCallback(
    (values: FormValues) => {
      const params = new URLSearchParams();

      if (values.keyword) params.set("keyword", values.keyword);
      if (values.location) params.set("location", values.location);
      if (values.minAmount) params.set("minAmount", values.minAmount);
      if (values.maxAmount) params.set("maxAmount", values.maxAmount);
      if (values.sortBy) params.set("sortBy", values.sortBy);
      if (values.sortDirection && values.sortDirection !== "ASC") {
        params.set("sortDirection", values.sortDirection);
      }

      return params.toString();
    },
    []
  );

   const updateURLDebounced = useCallback(
    (values: FormValues, immediate = false) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (immediate) {
        const queryString = createQueryString(values);
        const newURL = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(newURL, { scroll: false });
      } else {
        debounceTimeoutRef.current = setTimeout(() => {
          const queryString = createQueryString(values);
          const newURL = queryString ? `${pathname}?${queryString}` : pathname;
          router.push(newURL, { scroll: false });
        }, 500); // Debounce 500ms
      }
    },
    [createQueryString, router, pathname]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newValues = {
        ...formValues,
        [name]: value,
      };
      setFormValues(newValues);
      updateURLDebounced(newValues);
    },
    [formValues, updateURLDebounced]
  );

  // Handle select change
  const handleSelectChange = useCallback(
    (name: string, details: { value: string[] }) => {
      const newValues = {
        ...formValues,
        [name]: details.value[0] || "",
      };
      setFormValues(newValues);
      updateURLDebounced(newValues);
    },
    [formValues, updateURLDebounced]
  );

  // Handle search action
  const handleSearch = useCallback(() => {
    updateURLDebounced(formValues);
  }, [formValues, updateURLDebounced]);

  // Clear search
  const clearSearch = useCallback(() => {
    const clearedValues = { ...defaultValues };
    setFormValues(clearedValues);
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // Clear individual field (for keyword X button)
  const clearKeyword = useCallback(() => {
    const newValues = { ...formValues, keyword: "" };
    setFormValues(newValues);
    updateURLDebounced(newValues);
  }, [formValues, updateURLDebounced]);

  // Toggle advanced filters
  const toggleAdvanced = useCallback(() => {
    setShowAdvanced((prev) => !prev);
  }, []);

  // Handle Enter key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch]
  );

  // Check if form has values for clear button
  const hasValues = Object.entries(formValues).some(([key, value]) => {
    if (key === "sortDirection") return value !== "ASC";
    return value !== "";
  });

  // Create collections for selects
  const sortByOptions = createListCollection({
    items: [
      { label: "Default", value: "" },
      { label: "Amount", value: "amount" },
      { label: "Transaction Date", value: "transactionDate" },
      { label: "Type", value: "type" },
      { label: "Location", value: "location" },
    ],
  });

  const sortDirectionOptions = createListCollection({
    items: [
      { label: "Ascending", value: "ASC" },
      { label: "Descending", value: "DESC" },
    ],
  });

  // End element for InputGroup
  const endElement = (
    <Flex alignItems="center" gap={1}>
      {formValues.keyword && (
        <IconButton
          aria-label="Clear search"
          onClick={clearKeyword}
          size="sm"
          variant="ghost"
          color="gray.500"
        >
          <LuX />
        </IconButton>
      )}
      <IconButton
        aria-label="Search"
        onClick={handleSearch}
        size="sm"
        variant="ghost"
        color="gray.500"
      >
        <LuSearch />
      </IconButton>
      <IconButton
        aria-label="Advanced filters"
        onClick={toggleAdvanced}
        size="sm"
        variant="ghost"
        color={showAdvanced ? "blue.500" : "gray.500"}
      >
        <LuFilter />
      </IconButton>
    </Flex>
  );

  return (
    <Box
      width="100%"
      maxW="600px"
      margin="auto"
      position="relative"
      zIndex="10"
    >
      <Flex mb={4} gap={2}>
        <InputGroup
          flex="1"
          endElement={endElement}
          bg="gray.800"
          borderColor="gray.700"
          _hover={{ borderColor: "gray.600" }}
          rounded="xl"
        >
          <Input
            name="keyword"
            placeholder="Enter description"
            value={formValues.keyword}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            bg="transparent"
            color="gray.100"
            _placeholder={{ color: "gray.400" }}
            border="none"
            _focus={{ boxShadow: "none" }}
          />
        </InputGroup>

        {hasValues && (
          <Button
            variant="outline"
            onClick={clearSearch}
            size="md"
            borderColor="gray.700"
            color="gray.300"
            _hover={{ bg: "gray.700" }}
          >
            Clear All
          </Button>
        )}
      </Flex>

      {showAdvanced && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          right="0"
          mt={2}
          p={6}
          bg="gray.800"
          borderWidth="1px"
          borderColor="gray.700"
          rounded="2xl"
          shadow="2xl"
          backdropFilter="blur(12px)"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: "linear-gradient(45deg, rgba(60,110,255,0.05), rgba(50,50,50,0.1))",
            borderRadius: "2xl",
            pointerEvents: "none",
          }}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Field.Root>
              <Field.Label>Location</Field.Label>
              <Input
                name="location"
                placeholder="Enter location"
                value={formValues.location}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Min Amount</Field.Label>
              <Input
                name="minAmount"
                type="number"
                placeholder="Minimum amount"
                value={formValues.minAmount}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Max Amount</Field.Label>
              <Input
                name="maxAmount"
                type="number"
                placeholder="Maximum amount"
                value={formValues.maxAmount}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Sort By</Field.Label>
              <Select.Root
                collection={sortByOptions}
                name="sortBy"
                value={formValues.sortBy ? [formValues.sortBy] : []}
                onValueChange={(details) =>
                  handleSelectChange("sortBy", details)
                }
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select sort field" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {sortByOptions.items.map((option) => (
                        <Select.Item item={option} key={option.value}>
                          {option.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Field.Root>

            <Field.Root>
              <Field.Label>Sort Direction</Field.Label>
              <Select.Root
                collection={sortDirectionOptions}
                name="sortDirection"
                value={
                  formValues.sortDirection ? [formValues.sortDirection] : []
                }
                onValueChange={(details) =>
                  handleSelectChange("sortDirection", details)
                }
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select direction" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {sortDirectionOptions.items.map((option) => (
                        <Select.Item item={option} key={option.value}>
                          {option.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Field.Root>
          </SimpleGrid>

          <Flex mt={4} justifyContent="space-between">
            <Button variant="outline" onClick={clearSearch}>
              Clear Filters
            </Button>
            <Button colorScheme="blue" onClick={handleSearch}>
              Apply Filters
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default SearchForm;