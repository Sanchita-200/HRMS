# Database Architecture Design Manual - AI-HRMS

This document explains the database structure, schema designs, indexes, and soft-delete rules for the **AI-HRMS** relational schema.

---

## 🏛 Database Tables Catalog

The schema implements 20 database tables representing modular domains:

### 1. Identity & RBAC Layers
- **`permissions`**: Stores granular system operations permissions (e.g. `view:employee`, `approve:leave`).
- **`roles`**: Defines organizational access groups (e.g. `admin`, `manager`, `employee`).
- **`role_permissions`**: Joins `roles` and `permissions` in a many-to-many lookup table.
- **`users`**: Login credentials (email and password hash) referencing a specific `roles.id`.
- **`sessions`**: Tracks active JWT sessions and refresh tokens to handle session expirations.

### 2. Organization Layer
- **`departments`**: Defines organizational divisions (e.g. HR, Engineering, Sales) with unique codes.
- **`designations`**: Houses job titles, levels (L1, L2), and baseline salary grade scales.
- **`employees`**: The core profile metadata linked optionally to `users.id` (1:1), `departments.id`, `designations.id`, and self-referencing to `employees.id` (for manager hierarchy).

### 3. HR Operations Layer
- **`attendance`**: Daily check-in/check-out logs, working hours, and overtime. Includes composite indices on `(employee_id, date)`.
- **`leave_types`**: Leave classification rules (Sick, Casual, Paid).
- **`leave_requests`**: Submissions for leaves detailing dates, reason, approval state, and AI recommendations.

### 4. Payroll Ledger Layer
- **`payrolls`**: Monthly payroll ledger records storing consolidated earnings (basic, allowances, bonuses) and deductions (tax, custom deductions).
- **`salary_components`**: Itemized lines representing earnings or deductions linked to a `payroll.id` (e.g., House Rent Allowance, Provident Fund).

### 5. AI & Document Layers
- **`documents`**: Metadata for uploaded files (file name, disk/cloud path) linked to an employee.
- **`ai_conversations`**: Tracks prompt-response interactions grouped by conversation UUIDs.
- **`ai_embeddings`**: References text-split embeddings vectors in vector databases using float arrays.

### 6. Logging & Configurations Layers
- **`audit_logs`**: Capture database mutation transactions (CREATE, UPDATE, DELETE) and record old/new state snapshots.
- **`activity_logs`**: Tracks high-level business employee events (e.g., `leave-applied`, `profile-updated`).
- **`system_settings`**: Key-value settings properties for mailing keys, AI thresholds, etc.
- **`notifications`**: User alerts dispatch queue.

---

## ⚡ Query Indexing Strategy

To maintain sub-second query performance as data scales:

| Table Name | Index Name | Columns Index | Optimization Case |
| :--- | :--- | :--- | :--- |
| **`users`** | `idx_users_email` | `(email)` (Unique) | Rapid account lookup. |
| **`roles`** | `idx_roles_code` | `(code)` (Unique) | Role authorization lookups. |
| **`employees`** | `idx_employees_number` | `(employee_number)` (Unique) | Fast directory search. |
| **`attendance`** | `idx_attendance_employee_date` | `(employee_id, date)` (Unique) | Prevents double check-in, speeds up daily queries. |
| **`payrolls`** | `idx_payroll_employee_month` | `(employee_id, payroll_month)` | Rapid payroll runs and checks. |
| **`ai_conversations`**| `idx_ai_conversations_id` | `(conversation_id)` | Grouping chat histories. |
| **`ai_embeddings`** | `idx_ai_embeddings_vector_id` | `(vector_id)` (Unique) | Vector database indexing synchronization. |
| **`audit_logs`** | `idx_audit_logs_module` | `(module, timestamp)` | Admin audit queries. |

---

## 🔒 Cascade & Referential Integrity Rules

To keep database tables consistent:

- **Restrict on Core Relationships:** `User` has `role_id` foreign key configured with `ondelete="RESTRICT"`. This prevents deleting a system role that active users depend on.
- **Cascade on Child Entities:** Sub-components (e.g. `salary_components` inside `payrolls`, `sessions` inside `users`, `role_permissions` join references) use `ondelete="CASCADE"`. Deleting the parent entity automatically removes the associated child records, preventing orphaned database rows.
- **Set Null on History Preservations:** Deleting a `User` account sets the `user_id` inside `employees` to `NULL` via `ondelete="SET NULL"`. This allows historical employee records (attendance history, payrolls, documents) to be preserved for tax and legal compliance.
