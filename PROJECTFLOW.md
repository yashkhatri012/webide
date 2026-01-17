Application Architecture & Flow

End-to-end lifecycle of the application — authentication, playground creation, editing, persistence, and management.

1. Authentication
Entry Point

User visits /

app/(root)/page.tsx renders the homepage

Hero section displays Get Started

Auth Guard

Clicking Get Started redirects to /dashboard

middleware.ts validates authentication

If unauthenticated:

Redirect → /auth/sign-in

OAuth providers displayed (GitHub / Google)

OAuth Flow

User selects Sign in with GitHub

OAuth process initiates

auth.ts → signIn callback:

Check user existence by email

Create User + Account if new

Link Account if existing

JWT session created

Redirect → /dashboard

2. Dashboard
Page Load

Route: /dashboard

File: app/dashboard/page.tsx

Data Fetch (Server Component)
const playgrounds = await getAllPlaygroundForUser();

Database Query
db.playground.findMany({
  where: { userId: user?.id },
  include: { user: true, Starmark: true }
});

UI States

No projects → Empty state

Projects exist → ProjectTable rendered

3. Playground Creation
Trigger

User clicks Add New

AddNewButton opens TemplateSelectionModal

Step 1: Template Selection

Templates:

React

Next.js

Express

Vue

Hono

Angular

Search and category filtering supported

User selects a template

Step 2: Configuration

Optional project name

Click Create Project

Server Action
db.playground.create({
  data: {
    title: "My React App",
    template: "REACT",
    userId: user.id
  }
});

Result

Success toast

Redirect → /playground/[id]

4. Opening a Playground
Initialization

Route: /playground/[id]

File: app/playground/[id]/page.tsx

Hook: usePlayground(id)

Load Logic
const data = await getPlaygroundById(id);
const rawContent = data?.templateFiles?.[0]?.content;


Saved content exists

setTemplateData(JSON.parse(rawContent));


First-time open

fetch(`/api/template/${id}`);

5. Template Generation (First-Time Only)
API
/api/template/[id]

Flow

Fetch playground

Resolve template path
REACT → /starters/react-ts

Scan filesystem

Ignore:

node_modules

.git

Lock files

Build nested JSON tree

Return template structure

Client Processing
setTemplateData({
  folderName: "Root",
  items: templateJson
});


File tree rendered

Code editor initialized

6. Editing & Saving Code
Editing

User edits files

Changes tracked in local state

Save Operation
saveTemplateData(updatedData);

Persistence
db.templateFile.upsert({
  where: { playgroundId: id },
  update: { content: JSON.stringify(data) },
  create: { playgroundId: id, content: JSON.stringify(data) }
});

Outcome

Workspace saved as JSON

Toast confirmation

State synchronized

7. Returning Later

User revisits /dashboard

Opens existing playground

Load Behavior

Saved content detected

Template generation skipped

setTemplateData(JSON.parse(rawContent));


Previous work restored instantly

8. Playground Management

Supported actions:

✏️ Edit title / description

🗑 Delete playground

📄 Duplicate playground

⭐ Star / favorite playground

Data Flow Summary
User Action
  → Client Component
    → Server Action / API
      → Database

Example
Add New → AddNewButton → createPlayground() → MongoDB
Edit Code → Editor → saveTemplateData() → TemplateFile
