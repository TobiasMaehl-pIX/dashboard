import { getFilterOrDefault, saveFilter } from '@/services/filterService';
import { z } from 'zod';
import { publicProcedure, router } from './trpc';

// Define enum types locally since Prisma client may not be available
const EmploymentType = z.enum(['fulltime', 'parttime', 'contractor', 'intern']);
const WorkArrangement = z.enum(['hybrid', 'onsite', 'remote']);

export const appRouter = router({
  getFilterOrDefault: publicProcedure
    .input(z.object({ scope: z.string() }))
    .query(async ({ input }) => {
      return await getFilterOrDefault(input.scope);
    }),

  saveFilter: publicProcedure
    .input(
      z.object({
        scope: z.string(),
        dateRangeFrom: z.coerce.date().nullable().optional(),
        dateRangeTo: z.coerce.date().nullable().optional(),
        tenure: z.number().optional().nullable(),
        location: z.string().optional().nullable(),
        employmentType: EmploymentType.optional().nullable(),
        workArrangement: WorkArrangement.optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      return await saveFilter(input);
    }),
});

export type AppRouter = typeof appRouter;
