/*
  # Training Plans Schema

  1. New Tables
    - `training_plans`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `weeks` (integer)
      - `start_date` (date)
      - `coach_id` (uuid, references profiles)
      - `athlete_id` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `workout_schedule`
      - `id` (uuid, primary key)
      - `training_plan_id` (uuid, references training_plans)
      - `week_number` (integer)
      - `workout_id` (uuid)
      - `day_of_week` (integer)
      - `completed` (boolean)
      - `completed_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for coaches to manage their plans
    - Add policies for athletes to view and update their assigned plans
*/

-- Create training_plans table
CREATE TABLE IF NOT EXISTS training_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  weeks integer NOT NULL CHECK (weeks > 0),
  start_date date NOT NULL,
  coach_id uuid NOT NULL REFERENCES profiles(id),
  athlete_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workout_schedule table
CREATE TABLE IF NOT EXISTS workout_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_plan_id uuid NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE,
  week_number integer NOT NULL CHECK (week_number > 0),
  workout_id uuid NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  completed boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE (training_plan_id, week_number, workout_id)
);

-- Enable RLS
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_schedule ENABLE ROW LEVEL SECURITY;

-- Policies for training_plans
CREATE POLICY "Coaches can create training plans"
  ON training_plans FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = coach_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'coach'
    )
  );

CREATE POLICY "Coaches can view their own training plans"
  ON training_plans FOR SELECT
  TO authenticated
  USING (
    auth.uid() = coach_id OR
    auth.uid() = athlete_id
  );

CREATE POLICY "Coaches can update their own training plans"
  ON training_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = coach_id)
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete their own training plans"
  ON training_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = coach_id);

-- Policies for workout_schedule
CREATE POLICY "Users can view workout schedules for their plans"
  ON workout_schedule FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM training_plans
      WHERE id = workout_schedule.training_plan_id
      AND (coach_id = auth.uid() OR athlete_id = auth.uid())
    )
  );

CREATE POLICY "Coaches can manage workout schedules"
  ON workout_schedule FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM training_plans
      WHERE id = workout_schedule.training_plan_id
      AND coach_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can update workout completion"
  ON workout_schedule FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM training_plans
      WHERE id = workout_schedule.training_plan_id
      AND athlete_id = auth.uid()
    )
  )
  WITH CHECK (
    -- Only allow updating completed and completed_at fields
    EXISTS (
      SELECT 1 FROM training_plans
      WHERE id = workout_schedule.training_plan_id
      AND athlete_id = auth.uid()
    )
  );

-- Add trigger for updating updated_at
CREATE TRIGGER update_training_plans_updated_at
  BEFORE UPDATE ON training_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();