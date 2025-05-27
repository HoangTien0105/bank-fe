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
    accountType?: string;
    balanceType?: string;
    sortBy?: string;
    sortDirection?: string;
  };
}

interface FormValues {
  keyword: string;
  accountType: string;
  balanceType: string;
  sortBy: string;
  sortDirection: string;
}

const defaultValues: FormValues = {
  keyword: "",
  accountType: "",
  balanceType: "",
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
      accountType: searchParams.get("accountType") || "",
      balanceType: searchParams.get("balanceType") || "",
      sortBy: searchParams.get("sortBy") || "",
      sortDirection: searchParams.get("sortDirection") || "ASC",
    };

    setFormValues(urlValues);
  }, [searchParams]);

  // Create new searchParams from formValues
  const createQueryString = useCallback((values: FormValues) => {
    const params = new URLSearchParams();

    if (values.keyword) params.set("keyword", values.keyword);
    if (values.accountType) params.set("accountType", values.accountType);
    if (values.balanceType) params.set("balanceType", values.balanceType);
    if (values.sortBy) params.set("sortBy", values.sortBy);
    if (values.sortDirection && values.sortDirection !== "ASC") {
      params.set("sortDirection", values.sortDirection);
    }

    return params.toString();
  }, []);

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
    updateURLDebounced(formValues, true);
  }, [formValues, updateURLDebounced]);

  // Clear search
  const clearSearch = useCallback(() => {
    const clearedValues = { ...defaultValues };
    setFormValues(clearedValues);
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const clearKeyword = useCallback(() => {
    const newValues = { ...formValues, keyword: "" };
    setFormValues(newValues);
    updateURLDebounced(newValues);
  }, [formValues, updateURLDebounced]);

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
  const accountTypeOptions = createListCollection({
    items: [
      { label: "All Types", value: "" },
      { label: "Checking", value: "CHECKING" },
      { label: "Saving", value: "SAVING" },
    ],
  });

  const balanceTypeOptions = createListCollection({
    items: [
      { label: "All Types", value: "" },
      { label: "Low", value: "LOW" },
      { label: "Medium", value: "MEDIUM" },
      { label: "High", value: "HIGH" },
    ],
  });

  const sortByOptions = createListCollection({
    items: [
      { label: "Default", value: "" },
      { label: "Balance", value: "balance" },
      { label: "Open Date", value: "openDate" },
      { label: "Account Type", value: "accountType" },
      { label: "Interest Rate", value: "interestRate" },
    ],
  });

  const sortDirectionOptions = createListCollection({
    items: [
      { label: "Ascending", value: "ASC" },
      { label: "Descending", value: "DESC" },
    ],
  });


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
      userSelect="none"
    >
      <Flex mb={4} gap={2}>
        <InputGroup flex="1" endElement={endElement}>
          <Input
            name="keyword"
            placeholder="Search accounts..."
            value={formValues.keyword}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </InputGroup>

        {hasValues && (
          <Button
            variant="outline"
            colorScheme="gray"
            onClick={clearSearch}
            size="md"
          >
            Clear
          </Button>
        )}
      </Flex>

      {showAdvanced && (
        <Box
          borderWidth="1px"
          borderRadius="md"
          p={4}
          mb={4}
          bg="white"
          _dark={{ bg: "gray.800" }}
          boxShadow="md"
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mb={4}>
            <Field.Root>
              <Field.Label>Account Type</Field.Label>
              <Select.Root
                collection={accountTypeOptions}
                name="accountType"
                value={formValues.accountType ? [formValues.accountType] : []}
                onValueChange={(details) =>
                  handleSelectChange("accountType", details)
                }
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select account type" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {accountTypeOptions.items.map((option) => (
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
              <Field.Label>Balance Type</Field.Label>
              <Select.Root
                collection={balanceTypeOptions}
                name="balanceType"
                value={formValues.balanceType ? [formValues.balanceType] : []}
                onValueChange={(details) =>
                  handleSelectChange("balanceType", details)
                }
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select balance type" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {balanceTypeOptions.items.map((option) => (
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
                    <Select.ValueText placeholder="Sort by" />
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
                value={[formValues.sortDirection]}
                onValueChange={(details) =>
                  handleSelectChange("sortDirection", details)
                }
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Sort direction" />
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

          <Flex justifyContent="flex-end" gap={2}>
            <Button
              variant="outline"
              colorScheme="gray"
              onClick={clearSearch}
              size="sm"
            >
              Clear All
            </Button>
            <Button colorScheme="blue" onClick={handleSearch} size="sm">
              Apply Filters
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default SearchForm;