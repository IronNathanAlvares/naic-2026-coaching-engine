-- 002: the clause the debrief was matched against.
--
-- A staff member who speaks a debrief should be shown the hotel's OWN wording
-- for that situation, not a generic tip. Resolving it once at extraction time
-- and storing the chunk id means every later read shows the same clause: the
-- retrieval is part of the record, not re-rolled on each page load.
ALTER TABLE shift_debrief
    ADD COLUMN IF NOT EXISTS standard_chunk_id uuid REFERENCES sop_chunk(id),
    ADD COLUMN IF NOT EXISTS standard_why      text;
