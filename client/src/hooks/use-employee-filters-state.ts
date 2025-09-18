'use client';

import { useCallback, useEffect, useState } from 'react';
import { type DateRange } from 'react-day-picker';
import { useDebounce } from 'use-debounce';
import { filterDto, trpc } from '../components/trpc-provider';

export interface Filters {
  dateRange: DateRange | undefined;
  tenure: number | undefined;
  location: string | undefined;
  employmentType: 'fulltime' | 'parttime' | 'contractor' | 'intern' | undefined;
  workArrangement: 'hybrid' | 'onsite' | 'remote' | undefined;
}

type EmploymentType = NonNullable<Filters['employmentType']>;
type WorkArrangement = NonNullable<Filters['workArrangement']>;

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  fulltime: 'Full-time',
  parttime: 'Part-time',
  contractor: 'Contractor',
  intern: 'Intern',
};

export const EMPLOYMENT_TYPE_OPTIONS = [
  ...Object.entries(EMPLOYMENT_TYPE_LABELS).map(([key, value]) => ({
    value: key as EmploymentType,
    label: value,
  })),
];

export const WORK_ARRANGEMENT_LABELS: Record<WorkArrangement, string> = {
  hybrid: 'Hybrid',
  onsite: 'Onsite',
  remote: 'Remote',
};

export const WORK_ARRANGEMENT_OPTIONS = [
  ...Object.entries(WORK_ARRANGEMENT_LABELS).map(([key, value]) => ({
    value: key as WorkArrangement,
    label: value,
  })),
];

function mapDateRange(filterDto: filterDto): DateRange | undefined {
  if (!filterDto?.dateRangeFrom) {
    return undefined;
  }

  return {
    from: new Date(filterDto.dateRangeFrom),
    to: filterDto.dateRangeTo ? new Date(filterDto.dateRangeTo) : undefined,
  };
}

function mapToClientFilterModel(filterDto: filterDto): Filters {
  return {
    dateRange: mapDateRange(filterDto),
    tenure: filterDto?.tenure || undefined,
    location: filterDto?.location || undefined,
    employmentType: filterDto?.employmentType || undefined,
    workArrangement: filterDto?.workArrangement || undefined,
  };
}

function mapToServerFilterDto(filters: Filters, scope: string) {
  return {
    scope,
    dateRangeFrom: filters.dateRange?.from || null,
    dateRangeTo: filters.dateRange?.to || null,
    tenure: filters.tenure || null,
    location: filters.location || null,
    employmentType: filters.employmentType || null,
    workArrangement: filters.workArrangement || null,
  };
}

export function usePersistedFilterState(scope: string) {
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { data: filterDto, error: queryError } =
    trpc.getFilterOrDefault.useQuery({ scope });

  const [filters, setFilters] = useState<Filters | null>(() => {
    if (filterDto) {
      return mapToClientFilterModel(filterDto);
    }
    return null;
  });

  // Handle successful data loading - only on initial load
  useEffect(() => {
    if (filterDto) {
      const filter = mapToClientFilterModel(filterDto);
      console.log('set initial filter load', scope);
      setFilters(filter);
    }
  }, [filterDto, scope]);

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      console.error('Failed to load filters:', queryError);
      setError(`Failed to load filters: ${queryError.message}`);
    }
  }, [queryError]);

  // Save filter mutation
  const saveFilterMutation = trpc.saveFilter.useMutation({
    onError: (err) => {
      console.error('Failed to save filters:', err);
      setError(`Failed to save filters: ${err.message}`);
    },
    onSuccess: () => {
      console.log('save filter success', scope);
    },
  });

  const [debouncedFilters] = useDebounce(filters, 500);
  // Save filters when debounced value changes (but not during initial load)
  useEffect(() => {
    if (debouncedFilters === null || isInitialLoad) {
      return;
    }

    setError(null);
    const serverData = mapToServerFilterDto(debouncedFilters, scope);
    saveFilterMutation.mutate(serverData);
  }, [debouncedFilters, scope, isInitialLoad]); // Removed saveFilterMutation from deps

  const updateFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setIsInitialLoad(false);
      console.log('update filter', scope);
      setFilters((prev) => (prev === null ? prev : { ...prev, [key]: value }));
    },
    [scope],
  );

  const clearFilters = useCallback(() => {
    console.log('clear filters', scope);
    setIsInitialLoad(false);
    const clearedFilters = {
      dateRange: undefined,
      tenure: undefined,
      location: undefined,
      employmentType: undefined,
      workArrangement: undefined,
    };
    setFilters(clearedFilters);
  }, [scope]);

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    error,
  };
}
