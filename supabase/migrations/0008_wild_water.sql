/*
  # Add Nutrition Plans

  1. New Tables
    - `nutrition_plans`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `weeks` (integer)
      - `start_date` (date)
      - `coach_id` (uuid, references profiles)
      - `athlete_id` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `meal_schedule`
      - `id` (uuid, primary key)
      - `nutrition_plan_id` (uuid, references nutrition_plans)
      - `week_number` (integer)
      - `day_of_week` (integer)
      - `meal_type` (text: breakfast, lunch, dinner, snack)
      - `name` (text)
      - `description` (text)
      - `calories` (integer)
      - `protein` (integer)
      - `carbs` (integer)
      - `fats` (integer)
      - `completed` (boolean)
      - `completed_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for coaches and athletes
*/

-- Create nutrition_plans table
CREATE TABLE IF NOT EXISTS nutrition_plans (
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

-- Create meal_schedule table
CREATE TABLE IF NOT EXISTS meal_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nutrition_plan_id uuid NOT NULL REFERENCES nutrition_plans(id) ON DELETE CASCADE,
  week_number integer NOT NULL CHECK (week_number > 0),
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  name text NOT NULL,
  description text,
  calories integer,
  protein integer,
  carbs integer,
  fats integer,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE (nutrition_plan_id, week_number, day_of_week, meal_type)
);

-- Enable RLS
ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_schedule ENABLE ROW LEVEL SECURITY;

-- Policies for nutrition_plans
CREATE POLICY "Coaches can create nutrition plans"
  ON nutrition_plans FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = coach_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'coach'
    )
  );

CREATE POLICY "Coaches can view their own nutrition plans"
  ON nutrition_plans FOR SELECT
  TO authenticated
  USING (
    auth.uid() = coach_id OR
    auth.uid() = athlete_id
  );

CREATE POLICY "Coaches can update their own nutrition plans"
  ON nutrition_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = coach_id)
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete their own nutrition plans"
  ON nutrition_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = coach_id);

-- Policies for meal_schedule
CREATE POLICY "Users can view meal schedules for their plans"
  ON meal_schedule FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nutrition_plans
      WHERE id = meal_schedule.nutrition_plan_id
      AND (coach_id = auth.uid() OR athlete_id = auth.uid())
    )
  );

CREATE POLICY "Coaches can manage meal schedules"
  ON meal_schedule FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nutrition_plans
      WHERE id = meal_schedule.nutrition_plan_id
      AND coach_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can update meal completion"
  ON meal_schedule FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nutrition_plans
      WHERE id = meal_schedule.nutrition_plan_id
      AND athlete_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nutrition_plans
      WHERE id = meal_schedule.nutrition_plan_id
      AND athlete_id = auth.uid()
    )
  );

-- Add trigger for updating updated_at
CREATE TRIGGER update_nutrition_plans_updated_at
  BEFORE UPDATE ON nutrition_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();