// Define types locally since Prisma client may not be available
export type EmploymentType = 'fulltime' | 'parttime' | 'contractor' | 'intern';
export type WorkArrangement = 'hybrid' | 'onsite' | 'remote';

export interface FilterState {
  scope: string;
  dateRangeFrom: Date | null;
  dateRangeTo: Date | null;
  tenure: number | null;
  location: string | null;
  employmentType: EmploymentType | null;
  workArrangement: WorkArrangement | null;
  updatedAt: Date;
}

// Mock Prisma client for development
const mockPrisma = {
  filterState: {
    findUnique: async (options: any): Promise<FilterState | null> => {
      // For now, return default filter
      return createDefaultFilter(options.where.scope);
    },
    upsert: async (options: any): Promise<FilterState> => {
      // Mock the upsert behavior
      const data = options.create || options.update;
      return {
        ...data,
        updatedAt: new Date(),
      };
    },
  },
};

export interface SaveFilterInput {
  scope: string;
  dateRangeFrom?: Date | null;
  dateRangeTo?: Date | null;
  tenure?: number | null;
  location?: string | null;
  employmentType?: EmploymentType | null;
  workArrangement?: WorkArrangement | null;
}

/**
 * Get a filter by scope (name)
 * @param scope - The scope/name of the filter to retrieve
 * @returns The filter state or a default filter if not found
 */
export async function getFilterOrDefault(
  scope: string,
): Promise<FilterState | null> {
  try {
    const filter = await mockPrisma.filterState.findUnique({
      where: {
        scope: scope,
      },
    });
    return filter || createDefaultFilter(scope);
  } catch (error) {
    console.error('Error getting filter:', error);
    throw new Error(`Failed to get filter with scope: ${scope}`);
  }
}

/**
 * Save a filter (creates new or updates existing)
 * @param filterData - The filter data to save
 * @returns The saved filter state
 */
export async function saveFilter(
  filterData: SaveFilterInput,
): Promise<FilterState> {
  try {
    const savedFilter = await mockPrisma.filterState.upsert({
      where: {
        scope: filterData.scope,
      },
      update: {
        dateRangeFrom: filterData.dateRangeFrom,
        dateRangeTo: filterData.dateRangeTo,
        tenure: filterData.tenure,
        location: filterData.location,
        employmentType: filterData.employmentType,
        workArrangement: filterData.workArrangement,
        updatedAt: new Date(),
      },
      create: {
        scope: filterData.scope,
        dateRangeFrom: filterData.dateRangeFrom,
        dateRangeTo: filterData.dateRangeTo,
        tenure: filterData.tenure,
        location: filterData.location,
        employmentType: filterData.employmentType,
        workArrangement: filterData.workArrangement,
        updatedAt: new Date(),
      },
    });
    return savedFilter;
  } catch (error) {
    console.error('Error saving filter:', error);
    throw new Error(`Failed to save filter with scope: ${filterData.scope}`);
  }
}

function createDefaultFilter(scope: string): FilterState {
  return {
    scope: scope,
    dateRangeFrom: null,
    dateRangeTo: null,
    tenure: null,
    location: null,
    employmentType: null,
    workArrangement: null,
    updatedAt: new Date(),
  };
}
