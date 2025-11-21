-- Core tables
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password text not null,
  role text not null check (role in ('admin','agent','client'))
);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text,
  outstanding numeric default 0,
  currency text default 'SAR'
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  amount numeric not null,
  currency text default 'SAR',
  status text not null check (status in ('Paid','Issued','Overdue')),
  issue_date date not null,
  due_date date not null,
  title_en text,
  title_ar text,
  notes text
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null check (status in ('todo','in-progress','done')),
  owner text
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  name text,
  travelers integer,
  departure date,
  return_date date,
  lead_agent text
);

create table if not exists daily_sales_reports (
  id uuid primary key default gen_random_uuid(),
  reference text not null,
  date date not null,
  amount numeric not null
);

create table if not exists bank_transactions (
  id uuid primary key default gen_random_uuid(),
  reference text not null,
  date date not null,
  amount numeric not null,
  matched_report_id uuid references daily_sales_reports(id)
);

create table if not exists cash_handovers (
  id uuid primary key default gen_random_uuid(),
  amount numeric not null,
  note text,
  created_at timestamptz default now(),
  recorded_by text
);

create table if not exists uploads (
  id uuid primary key default gen_random_uuid(),
  file_name text,
  uploaded_at timestamptz default now(),
  progress integer default 0
);

-- Basic RLS configuration
alter table users enable row level security;
alter table invoices enable row level security;
alter table suppliers enable row level security;
alter table tasks enable row level security;
alter table bookings enable row level security;
alter table daily_sales_reports enable row level security;
alter table bank_transactions enable row level security;
alter table cash_handovers enable row level security;
alter table uploads enable row level security;

create policy "public read" on users for select using (true);
create policy "public read" on invoices for select using (true);
create policy "public read" on suppliers for select using (true);
create policy "public read" on tasks for select using (true);
create policy "public read" on bookings for select using (true);
create policy "public read" on daily_sales_reports for select using (true);
create policy "public read" on bank_transactions for select using (true);
create policy "public read" on cash_handovers for select using (true);
create policy "public read" on uploads for select using (true);

create policy "authenticated write" on users for all using (auth.role() = 'authenticated') with check (true);
create policy "authenticated write" on invoices for all using (auth.role() = 'authenticated') with check (true);
create policy "authenticated write" on suppliers for all using (auth.role() = 'authenticated') with check (true);
create policy "authenticated write" on tasks for all using (auth.role() = 'authenticated') with check (true);
create policy "authenticated write" on bookings for all using (auth.role() = 'authenticated') with check (true);
create policy "authenticated write" on daily_sales_reports for all using (auth.role() = 'authenticated') with check (true);
create policy "authenticated write" on bank_transactions for all using (auth.role() = 'authenticated') with check (true);
create policy "authenticated write" on cash_handovers for all using (auth.role() = 'authenticated') with check (true);
create policy "authenticated write" on uploads for all using (auth.role() = 'authenticated') with check (true);
