Phase 1: Authentication
User visits homepage (/)
app/(root)/page.tsx renders
Sees hero section with "Get Started" button
User clicks "Get Started"
Redirected to /dashboard
middleware.ts checks authentication
If not authenticated:
Redirected to /auth/sign-in
User sees OAuth options (GitHub/Google)
User clicks "Sign in with GitHub"
OAuth flow starts
auth.ts signIn callback executes:
Checks if user exists by email
If new: creates User + Account records
If existing: links new Account
Session created (JWT)
Redirected to /dashboard
Phase 2: Dashboard
Dashboard loads (app/dashboard/page.tsx)
Server component fetches data:
     const playgrounds = await getAllPlaygroundForUser();
Server action queries database:
     db.playground.findMany({         where: { userId: user?.id },         include: { user: true, Starmark: true }     })
Renders dashboard with playground list
User sees empty state or existing playgrounds
If empty: shows "No projects Found"
If has projects: shows ProjectTable
Phase 3: Creating Playground
User clicks "Add New" button
AddNewButton component (client)
Opens TemplateSelectionModal
Template selection (Step 1)
User sees 6 templates (React, Next.js, Express, Vue, Hono, Angular)
Can search/filter by category
Selects a template (e.g., "React")
Project configuration (Step 2)
User enters project name (optional)
Clicks "Create Project"
Playground creation
handleSubmit in AddNewButton:
      const res = await createPlayground({          title: "My React App",          template: "REACT",          description: "..."      });
Server action createPlayground():
Gets current user via currentUser()
Creates Playground record:
        db.playground.create({            data: {                title: "My React App",                template: "REACT",                userId: user.id            }        })
Returns playground with id
Success toast shown
User redirected to /playground/[id]
Phase 4: Opening Playground
Playground page loads (app/playground/[id]/page.tsx)
Client component (needs useParams)
Uses usePlayground(id) hook
Hook initialization
useEffect triggers loadPlayground()
Sets isLoading = true
Data loading decision
    const data = await getPlaygroundById(id);    const rawContent = data?.templateFiles?.[0]?.content;        if (typeof rawContent === "string") {        // Has saved content - use it        const parsedContent = JSON.parse(rawContent);        setTemplateData(parsedContent);    } else {        // No saved content - generate template        const res = await fetch(`/api/template/${id}`);        // ...    }
Template generation (first time)
API route /api/template/[id]:
Fetches playground → gets template: "REACT"
Maps to path: templatePaths.REACT → /starters/react-ts
Scans filesystem:
Reads all files in /starters/react-ts
Ignores: node_modules, .git, lock files
Creates nested JSON structure
Returns template JSON
Hook processes response:
      setTemplateData({          folderName: "Root",          items: templateRes.templateJson      });
isLoading = false
Template data ready
UI renders
File tree shows folder structure
Code editor shows file contents
User can start editing
Phase 5: Editing Code
User edits code
Changes tracked in component state
Editor shows modified files
User saves (manual or auto-save)
Calls saveTemplateData(updatedData)
Save operation
Hook calls SaveUpdatedCode(id, data)
Server action:
      db.templateFile.upsert({          where: { playgroundId: id },          update: { content: JSON.stringify(data) },          create: { playgroundId: id, content: JSON.stringify(data) }      })
Entire template structure saved as JSON
Success toast shown
Local state updated
Phase 6: Returning Later
User closes browser, returns later
Navigates to /dashboard
Sees their playground in list
Opens playground again
Same flow as step 11-14
But this time: rawContent exists
Skips template generation
Loads saved content directly:
      const parsedContent = JSON.parse(rawContent);      setTemplateData(parsedContent);
User sees their saved work immediately
Phase 7: Managing Playgrounds
User can:
Edit title/description → editProjectById()
Delete playground → deleteProjectById()
Duplicate playground → duplicateProjectById()
Star/favorite → StarMark model


User Action → Client Component → Server Action/API → Database
     ↓              ↓                    ↓              ↓
Click "Add New" → AddNewButton → createPlayground() → MongoDB
     ↓              ↓                    ↓              ↓
Select Template → Modal → handleSubmit → Create Playground Record
     ↓              ↓                    ↓              ↓
Open Playground → usePlayground → getPlaygroundById() → Fetch Playground
     ↓              ↓                    ↓              ↓
No Saved Code → Hook → /api/template/[id] → Scan Filesystem → Return JSON
     ↓              ↓                    ↓              ↓
Edit Code → Editor → saveTemplateData() → SaveUpdatedCode() → Upsert TemplateFile
     ↓              ↓                    ↓              ↓
Save Success → Toast → State Updated → Content Saved as JSON