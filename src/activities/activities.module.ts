import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService, PrismaService, SupabaseService],
})
export class ActivitiesModule {}
