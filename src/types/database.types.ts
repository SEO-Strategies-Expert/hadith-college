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
      announcement_reads: {
        Row: {
          announcement_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcement_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_targets: {
        Row: {
          announcement_id: string
          created_at: string
          id: string
          target_id: string | null
          target_type: Database["public"]["Enums"]["announcement_target_type"]
        }
        Insert: {
          announcement_id: string
          created_at?: string
          id?: string
          target_id?: string | null
          target_type: Database["public"]["Enums"]["announcement_target_type"]
        }
        Update: {
          announcement_id?: string
          created_at?: string
          id?: string
          target_id?: string | null
          target_type?: Database["public"]["Enums"]["announcement_target_type"]
        }
        Relationships: [
          {
            foreignKeyName: "announcement_targets_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_pinned: boolean
          priority: Database["public"]["Enums"]["announcement_priority"]
          published_at: string | null
          section_id: string | null
          status: Database["public"]["Enums"]["teaching_record_status"]
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_pinned?: boolean
          priority?: Database["public"]["Enums"]["announcement_priority"]
          published_at?: string | null
          section_id?: string | null
          status?: Database["public"]["Enums"]["teaching_record_status"]
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_pinned?: boolean
          priority?: Database["public"]["Enums"]["announcement_priority"]
          published_at?: string | null
          section_id?: string | null
          status?: Database["public"]["Enums"]["teaching_record_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_resources: {
        Row: {
          assignment_id: string
          created_at: string
          id: string
          resource_type: string
          resource_url: string | null
          sort_order: number
          storage_path: string | null
          title: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          id?: string
          resource_type?: string
          resource_url?: string | null
          sort_order?: number
          storage_path?: string | null
          title: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          id?: string
          resource_type?: string
          resource_url?: string | null
          sort_order?: number
          storage_path?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_resources_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_submissions: {
        Row: {
          assignment_id: string
          body_text: string | null
          created_at: string
          grade: number | null
          grade_published_at: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          is_late: boolean
          status: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          assignment_id: string
          body_text?: string | null
          created_at?: string
          grade?: number | null
          grade_published_at?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          is_late?: boolean
          status?: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          assignment_id?: string
          body_text?: string | null
          created_at?: string
          grade?: number | null
          grade_published_at?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          is_late?: boolean
          status?: Database["public"]["Enums"]["submission_status"]
          student_id?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_submissions_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          allow_late_submissions: boolean
          available_from: string | null
          course_id: string
          created_at: string
          created_by: string | null
          due_at: string | null
          id: string
          instructions: string | null
          points: number
          section_id: string
          status: Database["public"]["Enums"]["teaching_record_status"]
          title: string
          updated_at: string
        }
        Insert: {
          allow_late_submissions?: boolean
          available_from?: string | null
          course_id: string
          created_at?: string
          created_by?: string | null
          due_at?: string | null
          id?: string
          instructions?: string | null
          points?: number
          section_id: string
          status?: Database["public"]["Enums"]["teaching_record_status"]
          title: string
          updated_at?: string
        }
        Update: {
          allow_late_submissions?: boolean
          available_from?: string | null
          course_id?: string
          created_at?: string
          created_by?: string | null
          due_at?: string | null
          id?: string
          instructions?: string | null
          points?: number
          section_id?: string
          status?: Database["public"]["Enums"]["teaching_record_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_adjustment_requests: {
        Row: {
          attendance_record_id: string | null
          created_at: string
          id: string
          reason: string
          requested_status: Database["public"]["Enums"]["attendance_status"]
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["attendance_request_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          attendance_record_id?: string | null
          created_at?: string
          id?: string
          reason: string
          requested_status: Database["public"]["Enums"]["attendance_status"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["attendance_request_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          attendance_record_id?: string | null
          created_at?: string
          id?: string
          reason?: string
          requested_status?: Database["public"]["Enums"]["attendance_status"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["attendance_request_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_adjustment_requests_attendance_record_id_fkey"
            columns: ["attendance_record_id"]
            isOneToOne: false
            referencedRelation: "attendance_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_adjustment_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_adjustment_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          class_session_id: string
          id: string
          notes: string | null
          recorded_at: string
          recorded_by: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          class_session_id: string
          id?: string
          notes?: string | null
          recorded_at?: string
          recorded_by?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          class_session_id?: string
          id?: string
          notes?: string | null
          recorded_at?: string
          recorded_by?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_class_session_id_fkey"
            columns: ["class_session_id"]
            isOneToOne: false
            referencedRelation: "class_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      class_meetings: {
        Row: {
          created_at: string
          created_by: string | null
          ends_at: string
          id: string
          location: string | null
          meeting_mode: Database["public"]["Enums"]["meeting_mode"]
          online_meeting_url: string | null
          recording_url: string | null
          section_id: string
          starts_at: string
          status: Database["public"]["Enums"]["teaching_record_status"]
          timezone: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          ends_at: string
          id?: string
          location?: string | null
          meeting_mode?: Database["public"]["Enums"]["meeting_mode"]
          online_meeting_url?: string | null
          recording_url?: string | null
          section_id: string
          starts_at: string
          status?: Database["public"]["Enums"]["teaching_record_status"]
          timezone?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          ends_at?: string
          id?: string
          location?: string | null
          meeting_mode?: Database["public"]["Enums"]["meeting_mode"]
          online_meeting_url?: string | null
          recording_url?: string | null
          section_id?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["teaching_record_status"]
          timezone?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_meetings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_meetings_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      class_sessions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          section_id: string
          session_at: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          section_id: string
          session_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          section_id?: string
          session_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_sessions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
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
      final_grades: {
        Row: {
          created_at: string
          final_score: number | null
          id: string
          is_locked: boolean
          is_published: boolean
          letter_grade: string | null
          locked_at: string | null
          locked_by: string | null
          published_at: string | null
          section_id: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          final_score?: number | null
          id?: string
          is_locked?: boolean
          is_published?: boolean
          letter_grade?: string | null
          locked_at?: string | null
          locked_by?: string | null
          published_at?: string | null
          section_id: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          final_score?: number | null
          id?: string
          is_locked?: boolean
          is_published?: boolean
          letter_grade?: string | null
          locked_at?: string | null
          locked_by?: string | null
          published_at?: string | null
          section_id?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "final_grades_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "final_grades_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "final_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_categories: {
        Row: {
          created_at: string
          id: string
          name_ar: string
          section_id: string
          slug: string
          sort_order: number
          updated_at: string
          weight_percentage: number
        }
        Insert: {
          created_at?: string
          id?: string
          name_ar: string
          section_id: string
          slug: string
          sort_order?: number
          updated_at?: string
          weight_percentage?: number
        }
        Update: {
          created_at?: string
          id?: string
          name_ar?: string
          section_id?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          weight_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "grade_categories_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_items: {
        Row: {
          category_id: string
          created_at: string
          created_by: string | null
          id: string
          is_published: boolean
          points: number
          source_id: string | null
          source_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          points?: number
          source_id?: string | null
          source_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          points?: number
          source_id?: string | null
          source_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grade_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "grade_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grade_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_publications: {
        Row: {
          id: string
          notes: string | null
          published_at: string
          published_by: string | null
          section_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          published_at?: string
          published_by?: string | null
          section_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          published_at?: string
          published_by?: string | null
          section_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grade_publications_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grade_publications_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
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
      meeting_attendance_links: {
        Row: {
          class_session_id: string
          created_at: string
          id: string
          meeting_id: string
        }
        Insert: {
          class_session_id: string
          created_at?: string
          id?: string
          meeting_id: string
        }
        Update: {
          class_session_id?: string
          created_at?: string
          id?: string
          meeting_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_attendance_links_class_session_id_fkey"
            columns: ["class_session_id"]
            isOneToOne: false
            referencedRelation: "class_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_attendance_links_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "class_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_occurrences: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          meeting_id: string
          notes: string | null
          starts_at: string
          status: Database["public"]["Enums"]["teaching_record_status"]
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          meeting_id: string
          notes?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["teaching_record_status"]
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          meeting_id?: string
          notes?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["teaching_record_status"]
        }
        Relationships: [
          {
            foreignKeyName: "meeting_occurrences_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "class_meetings"
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
      notification_deliveries: {
        Row: {
          attempts: number
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          next_attempt_at: string | null
          notification_id: string
          provider: string | null
          provider_message_id: string | null
          status: string
        }
        Insert: {
          attempts?: number
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          next_attempt_at?: string | null
          notification_id: string
          provider?: string | null
          provider_message_id?: string | null
          status?: string
        }
        Update: {
          attempts?: number
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          next_attempt_at?: string | null
          notification_id?: string
          provider?: string | null
          provider_message_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_deliveries_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          email_enabled: boolean
          event_settings: Json
          in_app_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          email_enabled?: boolean
          event_settings?: Json
          in_app_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          email_enabled?: boolean
          event_settings?: Json
          in_app_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          processed_at: string | null
          queued_at: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          processed_at?: string | null
          queued_at?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          processed_at?: string | null
          queued_at?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
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
      question_banks: {
        Row: {
          course_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          section_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          section_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          section_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_banks_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_banks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_banks_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      question_options: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          option_text: string
          question_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_text: string
          question_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_text?: string
          question_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          bank_id: string
          correct_answer: string | null
          created_at: string
          created_by: string | null
          explanation: string | null
          id: string
          points: number
          prompt: string
          question_type: Database["public"]["Enums"]["question_type"]
          status: Database["public"]["Enums"]["teaching_record_status"]
          updated_at: string
        }
        Insert: {
          bank_id: string
          correct_answer?: string | null
          created_at?: string
          created_by?: string | null
          explanation?: string | null
          id?: string
          points?: number
          prompt: string
          question_type: Database["public"]["Enums"]["question_type"]
          status?: Database["public"]["Enums"]["teaching_record_status"]
          updated_at?: string
        }
        Update: {
          bank_id?: string
          correct_answer?: string | null
          created_at?: string
          created_by?: string | null
          explanation?: string | null
          id?: string
          points?: number
          prompt?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          status?: Database["public"]["Enums"]["teaching_record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "question_banks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_answers: {
        Row: {
          answer_text: string | null
          attempt_id: string
          auto_score: number | null
          created_at: string
          feedback: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          is_correct: boolean | null
          manual_score: number | null
          question_id: string
          selected_option_ids: string[]
          updated_at: string
        }
        Insert: {
          answer_text?: string | null
          attempt_id: string
          auto_score?: number | null
          created_at?: string
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          is_correct?: boolean | null
          manual_score?: number | null
          question_id: string
          selected_option_ids?: string[]
          updated_at?: string
        }
        Update: {
          answer_text?: string | null
          attempt_id?: string
          auto_score?: number | null
          created_at?: string
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          is_correct?: boolean | null
          manual_score?: number | null
          question_id?: string
          selected_option_ids?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          attempt_number: number
          auto_score: number | null
          created_at: string
          expires_at: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          manual_score: number | null
          quiz_id: string
          score: number | null
          started_at: string
          status: Database["public"]["Enums"]["quiz_attempt_status"]
          student_id: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          attempt_number: number
          auto_score?: number | null
          created_at?: string
          expires_at?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          manual_score?: number | null
          quiz_id: string
          score?: number | null
          started_at?: string
          status?: Database["public"]["Enums"]["quiz_attempt_status"]
          student_id: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          attempt_number?: number
          auto_score?: number | null
          created_at?: string
          expires_at?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          manual_score?: number | null
          quiz_id?: string
          score?: number | null
          started_at?: string
          status?: Database["public"]["Enums"]["quiz_attempt_status"]
          student_id?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string
          id: string
          points: number
          question_id: string
          quiz_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number
          question_id: string
          quiz_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          question_id?: string
          quiz_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          attempts_allowed: number
          available_from: string | null
          available_until: string | null
          course_id: string
          created_at: string
          created_by: string | null
          duration_minutes: number | null
          id: string
          instructions: string | null
          passing_grade: number
          section_id: string
          show_correct_answers: boolean
          show_results: boolean
          shuffle_options: boolean
          shuffle_questions: boolean
          status: Database["public"]["Enums"]["teaching_record_status"]
          title: string
          updated_at: string
        }
        Insert: {
          attempts_allowed?: number
          available_from?: string | null
          available_until?: string | null
          course_id: string
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          instructions?: string | null
          passing_grade?: number
          section_id: string
          show_correct_answers?: boolean
          show_results?: boolean
          shuffle_options?: boolean
          shuffle_questions?: boolean
          status?: Database["public"]["Enums"]["teaching_record_status"]
          title: string
          updated_at?: string
        }
        Update: {
          attempts_allowed?: number
          available_from?: string | null
          available_until?: string | null
          course_id?: string
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          id?: string
          instructions?: string | null
          passing_grade?: number
          section_id?: string
          show_correct_answers?: boolean
          show_results?: boolean
          shuffle_options?: boolean
          shuffle_questions?: boolean
          status?: Database["public"]["Enums"]["teaching_record_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
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
      student_grades: {
        Row: {
          created_at: string
          created_by: string | null
          feedback: string | null
          grade_item_id: string
          id: string
          is_published: boolean
          score: number | null
          student_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          feedback?: string | null
          grade_item_id: string
          id?: string
          is_published?: boolean
          score?: number | null
          student_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          feedback?: string | null
          grade_item_id?: string
          id?: string
          is_published?: boolean
          score?: number | null
          student_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_grades_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_grade_item_id_fkey"
            columns: ["grade_item_id"]
            isOneToOne: false
            referencedRelation: "grade_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_updated_by_fkey"
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
      submission_feedback: {
        Row: {
          created_at: string
          created_by: string | null
          feedback_text: string
          id: string
          is_published: boolean
          score: number | null
          submission_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          feedback_text: string
          id?: string
          is_published?: boolean
          score?: number | null
          submission_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          feedback_text?: string
          id?: string
          is_published?: boolean
          score?: number | null
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_feedback_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_feedback_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "assignment_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_files: {
        Row: {
          created_at: string
          file_name: string
          file_url: string | null
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string | null
          submission_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_url?: string | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          submission_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_url?: string | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_files_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "assignment_submissions"
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
      autograde_quiz_attempt: {
        Args: { target_attempt_id: string }
        Returns: undefined
      }
      can_access_assignment: {
        Args: { target_assignment_id: string; target_user_id?: string }
        Returns: boolean
      }
      can_access_lesson: {
        Args: { target_lesson_id: string; target_user_id?: string }
        Returns: boolean
      }
      can_access_quiz: {
        Args: { target_quiz_id: string; target_user_id?: string }
        Returns: boolean
      }
      can_read_announcement: {
        Args: { target_announcement_id: string; target_user_id?: string }
        Returns: boolean
      }
      can_start_quiz_attempt: {
        Args: {
          target_quiz_id: string
          target_student_id: string
          target_user_id?: string
        }
        Returns: boolean
      }
      can_submit_assignment: {
        Args: {
          target_assignment_id: string
          target_student_id: string
          target_user_id?: string
        }
        Returns: boolean
      }
      create_in_app_notification: {
        Args: {
          body_text: string
          entity?: string
          entity_uuid?: string
          event: string
          target_user_id: string
          title_text: string
        }
        Returns: string
      }
      current_faculty_id: { Args: { target_user_id?: string }; Returns: string }
      current_student_id: { Args: { target_user_id?: string }; Returns: string }
      has_permission: {
        Args: { permission_slug: string; target_user_id?: string }
        Returns: boolean
      }
      has_role: {
        Args: { role_slug: string; target_user_id?: string }
        Returns: boolean
      }
      is_active_platform_user: {
        Args: { target_user_id?: string }
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
      student_section_ids: {
        Args: { target_student_id: string }
        Returns: string[]
      }
    }
    Enums: {
      academic_record_status:
        | "draft"
        | "pending_review"
        | "published"
        | "archived"
      announcement_priority: "low" | "normal" | "high" | "urgent"
      announcement_target_type:
        | "all"
        | "program"
        | "level"
        | "cohort"
        | "section"
        | "course"
        | "role"
        | "user"
      attendance_request_status: "pending" | "approved" | "rejected"
      attendance_status: "present" | "absent" | "late" | "excused"
      content_status: "draft" | "pending_review" | "published" | "archived"
      enrollment_status:
        | "active"
        | "withdrawn"
        | "completed"
        | "failed"
        | "archived"
      meeting_mode: "onsite" | "online" | "hybrid"
      navigation_location: "header" | "footer" | "dashboard"
      notification_channel: "in_app" | "email"
      question_type:
        | "multiple_choice"
        | "true_false"
        | "multiple_select"
        | "short_answer"
        | "essay"
      quiz_attempt_status: "in_progress" | "submitted" | "graded" | "expired"
      student_academic_status:
        | "applicant"
        | "accepted"
        | "active"
        | "suspended"
        | "withdrawn"
        | "graduated"
        | "archived"
      submission_status: "draft" | "submitted" | "late" | "graded" | "returned"
      teaching_record_status: "draft" | "published" | "archived"
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
      announcement_priority: ["low", "normal", "high", "urgent"],
      announcement_target_type: [
        "all",
        "program",
        "level",
        "cohort",
        "section",
        "course",
        "role",
        "user",
      ],
      attendance_request_status: ["pending", "approved", "rejected"],
      attendance_status: ["present", "absent", "late", "excused"],
      content_status: ["draft", "pending_review", "published", "archived"],
      enrollment_status: [
        "active",
        "withdrawn",
        "completed",
        "failed",
        "archived",
      ],
      meeting_mode: ["onsite", "online", "hybrid"],
      navigation_location: ["header", "footer", "dashboard"],
      notification_channel: ["in_app", "email"],
      question_type: [
        "multiple_choice",
        "true_false",
        "multiple_select",
        "short_answer",
        "essay",
      ],
      quiz_attempt_status: ["in_progress", "submitted", "graded", "expired"],
      student_academic_status: [
        "applicant",
        "accepted",
        "active",
        "suspended",
        "withdrawn",
        "graduated",
        "archived",
      ],
      submission_status: ["draft", "submitted", "late", "graded", "returned"],
      teaching_record_status: ["draft", "published", "archived"],
      user_status: ["active", "invited", "suspended", "archived"],
    },
  },
} as const
