export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      academic_programs: {
        Row: {
          admission_requirements: string | null
          capacity: number | null
          certificate_type: string | null
          created_at: string
          created_by: string | null
          credit_hours: number | null
          deleted_at: string | null
          duration_months: number | null
          duration_text: string | null
          featured_image: string | null
          full_description: string | null
          id: string
          is_demo: boolean
          is_featured: boolean
          learning_outcomes: string | null
          name_ar: string
          name_en: string | null
          number_of_levels: number | null
          program_type: string | null
          qualification_type: string | null
          registration_close_at: string | null
          registration_open_at: string | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["academic_record_status"]
          study_end_at: string | null
          study_language: string | null
          study_mode: string | null
          study_start_at: string | null
          target_audience: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          admission_requirements?: string | null
          capacity?: number | null
          certificate_type?: string | null
          created_at?: string
          created_by?: string | null
          credit_hours?: number | null
          deleted_at?: string | null
          duration_months?: number | null
          duration_text?: string | null
          featured_image?: string | null
          full_description?: string | null
          id?: string
          is_demo?: boolean
          is_featured?: boolean
          learning_outcomes?: string | null
          name_ar: string
          name_en?: string | null
          number_of_levels?: number | null
          program_type?: string | null
          qualification_type?: string | null
          registration_close_at?: string | null
          registration_open_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["academic_record_status"]
          study_end_at?: string | null
          study_language?: string | null
          study_mode?: string | null
          study_start_at?: string | null
          target_audience?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          admission_requirements?: string | null
          capacity?: number | null
          certificate_type?: string | null
          created_at?: string
          created_by?: string | null
          credit_hours?: number | null
          deleted_at?: string | null
          duration_months?: number | null
          duration_text?: string | null
          featured_image?: string | null
          full_description?: string | null
          id?: string
          is_demo?: boolean
          is_featured?: boolean
          learning_outcomes?: string | null
          name_ar?: string
          name_en?: string | null
          number_of_levels?: number | null
          program_type?: string | null
          qualification_type?: string | null
          registration_close_at?: string | null
          registration_open_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["academic_record_status"]
          study_end_at?: string | null
          study_language?: string | null
          study_mode?: string | null
          study_start_at?: string | null
          target_audience?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_programs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academic_programs_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_terms: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          name_ar: string
          registration_closes_at: string | null
          registration_opens_at: string | null
          slug: string
          starts_at: string
          status: Database["public"]["Enums"]["academic_record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          name_ar: string
          registration_closes_at?: string | null
          registration_opens_at?: string | null
          slug: string
          starts_at: string
          status?: Database["public"]["Enums"]["academic_record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          name_ar?: string
          registration_closes_at?: string | null
          registration_opens_at?: string | null
          slug?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["academic_record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip: unknown
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cohorts: {
        Row: {
          capacity: number | null
          created_at: string
          id: string
          name_ar: string
          program_id: string
          slug: string
          status: Database["public"]["Enums"]["academic_record_status"]
          term_id: string | null
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          id?: string
          name_ar: string
          program_id: string
          slug: string
          status?: Database["public"]["Enums"]["academic_record_status"]
          term_id?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          id?: string
          name_ar?: string
          program_id?: string
          slug?: string
          status?: Database["public"]["Enums"]["academic_record_status"]
          term_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohorts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "academic_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohorts_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          assigned_to: string | null
          created_at: string
          deleted_at: string | null
          department: string | null
          email: string
          full_name: string
          id: string
          message: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          deleted_at?: string | null
          department?: string | null
          email: string
          full_name: string
          id?: string
          message: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          deleted_at?: string | null
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_revisions: {
        Row: {
          created_at: string
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          revision_number: number
          snapshot_json: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          revision_number: number
          snapshot_json: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          revision_number?: number
          snapshot_json?: Json
        }
        Relationships: [
          {
            foreignKeyName: "content_revisions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_instructors: {
        Row: {
          created_at: string
          faculty_id: string
          role: string
          section_id: string
        }
        Insert: {
          created_at?: string
          faculty_id: string
          role?: string
          section_id: string
        }
        Update: {
          created_at?: string
          faculty_id?: string
          role?: string
          section_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_instructors_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_instructors_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      course_learning_outcomes: {
        Row: {
          course_id: string
          created_at: string
          id: string
          outcome_ar: string
          sort_order: number
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          outcome_ar: string
          sort_order?: number
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          outcome_ar?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_learning_outcomes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          available_at: string | null
          course_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          section_id: string | null
          sort_order: number
          status: Database["public"]["Enums"]["academic_record_status"]
          title_ar: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          available_at?: string | null
          course_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          section_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["academic_record_status"]
          title_ar: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          available_at?: string | null
          course_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          section_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["academic_record_status"]
          title_ar?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_modules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_modules_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_modules_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_prerequisites: {
        Row: {
          course_id: string
          created_at: string
          prerequisite_course_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          prerequisite_course_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          prerequisite_course_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_prerequisites_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_prerequisites_prerequisite_course_id_fkey"
            columns: ["prerequisite_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_sections: {
        Row: {
          capacity: number
          cohort_id: string | null
          course_id: string
          created_at: string
          created_by: string | null
          ends_at: string | null
          id: string
          meeting_mode: string
          section_code: string
          starts_at: string | null
          status: Database["public"]["Enums"]["academic_record_status"]
          term_id: string
          timezone: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          capacity?: number
          cohort_id?: string | null
          course_id: string
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          meeting_mode?: string
          section_code: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["academic_record_status"]
          term_id: string
          timezone?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          capacity?: number
          cohort_id?: string | null
          course_id?: string
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          meeting_mode?: string
          section_code?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["academic_record_status"]
          term_id?: string
          timezone?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_sections_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sections_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sections_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "academic_terms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sections_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          attendance_requirement: number
          code: string
          course_type: string | null
          created_at: string
          created_by: string | null
          credit_hours: number
          deleted_at: string | null
          description: string | null
          featured_image: string | null
          id: string
          is_demo: boolean
          level_id: string | null
          name_ar: string
          name_en: string | null
          objectives: string | null
          passing_grade: number
          slug: string
          status: Database["public"]["Enums"]["academic_record_status"]
          study_hours: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          attendance_requirement?: number
          code: string
          course_type?: string | null
          created_at?: string
          created_by?: string | null
          credit_hours?: number
          deleted_at?: string | null
          description?: string | null
          featured_image?: string | null
          id?: string
          is_demo?: boolean
          level_id?: string | null
          name_ar: string
          name_en?: string | null
          objectives?: string | null
          passing_grade?: number
          slug: string
          status?: Database["public"]["Enums"]["academic_record_status"]
          study_hours?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          attendance_requirement?: number
          code?: string
          course_type?: string | null
          created_at?: string
          created_by?: string | null
          credit_hours?: number
          deleted_at?: string | null
          description?: string | null
          featured_image?: string | null
          id?: string
          is_demo?: boolean
          level_id?: string | null
          name_ar?: string
          name_en?: string | null
          objectives?: string | null
          passing_grade?: number
          slug?: string
          status?: Database["public"]["Enums"]["academic_record_status"]
          study_hours?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "program_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          created_by: string | null
          enrolled_at: string
          id: string
          section_id: string
          status: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
          withdrawn_at: string | null
        }
        Insert: {
          created_by?: string | null
          enrolled_at?: string
          id?: string
          section_id: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
          withdrawn_at?: string | null
        }
        Update: {
          created_by?: string | null
          enrolled_at?: string
          id?: string
          section_id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id?: string
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_profiles: {
        Row: {
          academic_title: string | null
          bio_full: string | null
          bio_short: string | null
          created_at: string
          created_by: string | null
          cv_file: string | null
          degree: string | null
          deleted_at: string | null
          experience: string | null
          full_name_ar: string
          full_name_en: string | null
          id: string
          ijazat_summary: string | null
          is_featured: boolean
          languages: string[]
          office_hours: string | null
          profile_image: string | null
          public_email: string | null
          research: string | null
          slug: string
          sort_order: number
          specialization: string | null
          status: Database["public"]["Enums"]["academic_record_status"]
          university: string | null
          updated_at: string
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          academic_title?: string | null
          bio_full?: string | null
          bio_short?: string | null
          created_at?: string
          created_by?: string | null
          cv_file?: string | null
          degree?: string | null
          deleted_at?: string | null
          experience?: string | null
          full_name_ar: string
          full_name_en?: string | null
          id?: string
          ijazat_summary?: string | null
          is_featured?: boolean
          languages?: string[]
          office_hours?: string | null
          profile_image?: string | null
          public_email?: string | null
          research?: string | null
          slug: string
          sort_order?: number
          specialization?: string | null
          status?: Database["public"]["Enums"]["academic_record_status"]
          university?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          academic_title?: string | null
          bio_full?: string | null
          bio_short?: string | null
          created_at?: string
          created_by?: string | null
          cv_file?: string | null
          degree?: string | null
          deleted_at?: string | null
          experience?: string | null
          full_name_ar?: string
          full_name_en?: string | null
          id?: string
          ijazat_summary?: string | null
          is_featured?: boolean
          languages?: string[]
          office_hours?: string | null
          profile_image?: string | null
          public_email?: string | null
          research?: string | null
          slug?: string
          sort_order?: number
          specialization?: string | null
          status?: Database["public"]["Enums"]["academic_record_status"]
          university?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_profiles_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer_ar: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          id: string
          is_demo: boolean
          page_id: string | null
          question_ar: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          answer_ar: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          is_demo?: boolean
          page_id?: string | null
          question_ar: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          answer_ar?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          is_demo?: boolean
          page_id?: string | null
          question_ar?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faqs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faqs_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faqs_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          is_completed: boolean
          last_position: string | null
          lesson_id: string
          progress_percentage: number
          started_at: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean
          last_position?: string | null
          lesson_id: string
          progress_percentage?: number
          started_at?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean
          last_position?: string | null
          lesson_id?: string
          progress_percentage?: number
          started_at?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_resources: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          mime_type: string | null
          resource_type: string
          size_bytes: number | null
          sort_order: number
          storage_path: string | null
          title_ar: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          mime_type?: string | null
          resource_type: string
          size_bytes?: number | null
          sort_order?: number
          storage_path?: string | null
          title_ar: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          mime_type?: string | null
          resource_type?: string
          size_bytes?: number | null
          sort_order?: number
          storage_path?: string | null
          title_ar?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_resources_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          audio_url: string | null
          available_at: string | null
          content_text: string | null
          created_at: string
          created_by: string | null
          external_url: string | null
          id: string
          module_id: string
          pdf_url: string | null
          references_text: string | null
          sort_order: number
          status: Database["public"]["Enums"]["academic_record_status"]
          title_ar: string
          updated_at: string
          updated_by: string | null
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          available_at?: string | null
          content_text?: string | null
          created_at?: string
          created_by?: string | null
          external_url?: string | null
          id?: string
          module_id: string
          pdf_url?: string | null
          references_text?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["academic_record_status"]
          title_ar: string
          updated_at?: string
          updated_by?: string | null
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          available_at?: string | null
          content_text?: string | null
          created_at?: string
          created_by?: string | null
          external_url?: string | null
          id?: string
          module_id?: string
          pdf_url?: string | null
          references_text?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["academic_record_status"]
          title_ar?: string
          updated_at?: string
          updated_by?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_files: {
        Row: {
          access_level: string
          alt_ar: string | null
          bucket: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          id: string
          is_demo: boolean
          mime_type: string | null
          path: string
          size_bytes: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          access_level?: string
          alt_ar?: string | null
          bucket: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          is_demo?: boolean
          mime_type?: string | null
          path: string
          size_bytes?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          access_level?: string
          alt_ar?: string | null
          bucket?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          is_demo?: boolean
          mime_type?: string | null
          path?: string
          size_bytes?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_files_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_files_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      navigation_items: {
        Row: {
          created_at: string
          created_by: string | null
          href: string
          id: string
          is_demo: boolean
          is_visible: boolean
          label_ar: string
          location: Database["public"]["Enums"]["navigation_location"]
          parent_id: string | null
          required_permission: string | null
          sort_order: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          href: string
          id?: string
          is_demo?: boolean
          is_visible?: boolean
          label_ar: string
          location?: Database["public"]["Enums"]["navigation_location"]
          parent_id?: string | null
          required_permission?: string | null
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          href?: string
          id?: string
          is_demo?: boolean
          is_visible?: boolean
          label_ar?: string
          location?: Database["public"]["Enums"]["navigation_location"]
          parent_id?: string | null
          required_permission?: string | null
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "navigation_items_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          content_json: Json
          created_at: string
          created_by: string | null
          deleted_at: string | null
          heading_ar: string | null
          heading_en: string | null
          id: string
          is_demo: boolean
          is_visible: boolean
          page_id: string
          section_type: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content_json?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          heading_ar?: string | null
          heading_en?: string | null
          id?: string
          is_demo?: boolean
          is_visible?: boolean
          page_id: string
          section_type: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content_json?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          heading_ar?: string | null
          heading_en?: string | null
          id?: string
          is_demo?: boolean
          is_visible?: boolean
          page_id?: string
          section_type?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_sections_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          excerpt_ar: string | null
          excerpt_en: string | null
          featured_image_id: string | null
          id: string
          is_demo: boolean
          published_at: string | null
          seo_description_ar: string | null
          seo_title_ar: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          template: string
          title_ar: string
          title_en: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured_image_id?: string | null
          id?: string
          is_demo?: boolean
          published_at?: string | null
          seo_description_ar?: string | null
          seo_title_ar?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          template?: string
          title_ar: string
          title_en?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured_image_id?: string | null
          id?: string
          is_demo?: boolean
          published_at?: string | null
          seo_description_ar?: string | null
          seo_title_ar?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          template?: string
          title_ar?: string
          title_en?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_featured_image_id_fkey"
            columns: ["featured_image_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description_ar: string | null
          id: string
          name_ar: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          id?: string
          name_ar: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          id?: string
          name_ar?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string
          full_name_ar: string | null
          full_name_en: string | null
          id: string
          last_seen_at: string | null
          phone: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email: string
          full_name_ar?: string | null
          full_name_en?: string | null
          id: string
          last_seen_at?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string
          full_name_ar?: string | null
          full_name_en?: string | null
          id?: string
          last_seen_at?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      program_courses: {
        Row: {
          course_id: string
          created_at: string
          id: string
          is_required: boolean
          level_id: string | null
          program_id: string
          sort_order: number
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          is_required?: boolean
          level_id?: string | null
          program_id: string
          sort_order?: number
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          is_required?: boolean
          level_id?: string | null
          program_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_courses_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "program_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_courses_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "academic_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_levels: {
        Row: {
          created_at: string
          description: string | null
          id: string
          level_number: number
          name_ar: string
          name_en: string | null
          program_id: string
          sort_order: number
          status: Database["public"]["Enums"]["academic_record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          level_number: number
          name_ar: string
          name_en?: string | null
          program_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["academic_record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          level_number?: number
          name_ar?: string
          name_en?: string | null
          program_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["academic_record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_levels_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "academic_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description_ar: string | null
          id: string
          is_system: boolean
          name_ar: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          id?: string
          is_system?: boolean
          name_ar: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          id?: string
          is_system?: boolean
          name_ar?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_metadata: {
        Row: {
          canonical_url: string | null
          created_at: string
          created_by: string | null
          description_ar: string | null
          id: string
          json_ld: Json | null
          og_image_id: string | null
          page_id: string
          title_ar: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          description_ar?: string | null
          id?: string
          json_ld?: Json | null
          og_image_id?: string | null
          page_id: string
          title_ar?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          description_ar?: string | null
          id?: string
          json_ld?: Json | null
          og_image_id?: string | null
          page_id?: string
          title_ar?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_metadata_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_metadata_og_image_id_fkey"
            columns: ["og_image_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_metadata_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: true
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_metadata_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_demo: boolean
          is_public: boolean
          key: string
          updated_at: string
          updated_by: string | null
          value_json: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_demo?: boolean
          is_public?: boolean
          key: string
          updated_at?: string
          updated_by?: string | null
          value_json?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_demo?: boolean
          is_public?: boolean
          key?: string
          updated_at?: string
          updated_by?: string | null
          value_json?: Json
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          academic_status: Database["public"]["Enums"]["student_academic_status"]
          admission_status: string
          country: string | null
          created_at: string
          created_by: string | null
          current_level_id: string | null
          date_of_birth: string | null
          deleted_at: string | null
          email: string
          fee_status: string
          full_name_ar: string
          full_name_en: string | null
          graduated_at: string | null
          id: string
          joined_at: string | null
          nationality: string | null
          notes: string | null
          phone: string | null
          program_id: string | null
          qualification: string | null
          student_number: string
          updated_at: string
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          academic_status?: Database["public"]["Enums"]["student_academic_status"]
          admission_status?: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          current_level_id?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          email: string
          fee_status?: string
          full_name_ar: string
          full_name_en?: string | null
          graduated_at?: string | null
          id?: string
          joined_at?: string | null
          nationality?: string | null
          notes?: string | null
          phone?: string | null
          program_id?: string | null
          qualification?: string | null
          student_number: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          academic_status?: Database["public"]["Enums"]["student_academic_status"]
          admission_status?: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          current_level_id?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          email?: string
          fee_status?: string
          full_name_ar?: string
          full_name_en?: string | null
          graduated_at?: string | null
          id?: string
          joined_at?: string | null
          nationality?: string | null
          notes?: string | null
          phone?: string | null
          program_id?: string | null
          qualification?: string | null
          student_number?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_profiles_current_level_id_fkey"
            columns: ["current_level_id"]
            isOneToOne: false
            referencedRelation: "program_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "academic_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_profiles_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_lesson: {
        Args: { target_lesson_id: string; target_user_id?: string }
        Returns: boolean
      }
      has_permission: {
        Args: { permission_slug: string; target_user_id?: string }
        Returns: boolean
      }
      has_role: {
        Args: { role_slug: string; target_user_id?: string }
        Returns: boolean
      }
      is_admin: { Args: { target_user_id?: string }; Returns: boolean }
      is_course_instructor: {
        Args: { target_course_id: string; target_user_id?: string }
        Returns: boolean
      }
      is_section_instructor: {
        Args: { target_section_id: string; target_user_id?: string }
        Returns: boolean
      }
      is_student_enrolled: {
        Args: { target_section_id: string; target_user_id?: string }
        Returns: boolean
      }
      owns_record: { Args: { record_user_id: string }; Returns: boolean }
    }
    Enums: {
      academic_record_status:
        | "draft"
        | "pending_review"
        | "published"
        | "archived"
      content_status: "draft" | "pending_review" | "published" | "archived"
      enrollment_status:
        | "active"
        | "withdrawn"
        | "completed"
        | "failed"
        | "archived"
      navigation_location: "header" | "footer" | "dashboard"
      student_academic_status:
        | "applicant"
        | "accepted"
        | "active"
        | "suspended"
        | "withdrawn"
        | "graduated"
        | "archived"
      user_status: "active" | "invited" | "suspended" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      academic_record_status: [
        "draft",
        "pending_review",
        "published",
        "archived",
      ],
      content_status: ["draft", "pending_review", "published", "archived"],
      enrollment_status: [
        "active",
        "withdrawn",
        "completed",
        "failed",
        "archived",
      ],
      navigation_location: ["header", "footer", "dashboard"],
      student_academic_status: [
        "applicant",
        "accepted",
        "active",
        "suspended",
        "withdrawn",
        "graduated",
        "archived",
      ],
      user_status: ["active", "invited", "suspended", "archived"],
    },
  },
} as const
