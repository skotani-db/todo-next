# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (with Turbopack)
npm run dev
# Access at http://localhost:3000

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture Overview

This is a modern Next.js 16 todo application using the App Router architecture with client-side state management.

### State Management Pattern

The app uses React's built-in state management (useState/useEffect) with localStorage persistence:
- State is centralized in `app/page.tsx` which acts as the state container
- CRUD operations (addTodo, toggleTodo, deleteTodo) are defined in the parent and passed down to child components
- Data persistence is handled via two useEffect hooks:
  - One loads todos from localStorage on mount and converts serialized dates back to Date objects
  - Another saves todos to localStorage whenever the state changes

### Component Architecture

```
app/page.tsx (State Container)
├── AddTodo (Controlled form component)
└── TodoList (Presentational wrapper)
    └── TodoItem (Individual todo with actions)
```

Components follow these patterns:
- **Client Components**: All interactive components use `"use client"` directive
- **Props Drilling**: State and handlers are passed through props (no context needed for this simple app)
- **Type Safety**: TypeScript interface defined in `app/types/todo.ts` ensures type consistency across all components

### Styling Pattern

Uses Tailwind CSS 4 with modern design patterns:
- Glass-morphism effects (`bg-white/60 backdrop-blur-md`)
- Gradient backgrounds and text (`bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50`)
- Hover states and transitions for interactive elements
- Group utilities for parent/child hover interactions (e.g., delete button appears on todo hover)
- lucide-react for consistent iconography

### Important Implementation Details

**localStorage Date Handling**: When loading from localStorage, dates are strings and must be converted back:
```typescript
const todosWithDates = parsedTodos.map((todo: Todo) => ({
  ...todo,
  createdAt: new Date(todo.createdAt),
}));
```

**UUID Generation**: Uses `crypto.randomUUID()` for generating unique IDs (requires modern browser support).

**Empty State Conditional**: TodoList component checks `todos.length === 0` and renders a specialized empty state rather than an empty div.

# テストコード作成時の遵守事項
## 絶対に守ってください！

### テストコードの品質
- テストは必ず実際の機能を検証すること
- `expect(true).toBe(true)`のような意味のないアサーションは絶対に書かない
- 各テストケースは具体的な入力と期待される出力を検証すること
- モックは必要最小限にとどめ、実際の動作に近い形でテストすること

### ハードコーディングの禁止
- テストを通すためだけのハードコードは絶対禁止
- 本番コードに`if(testMode)`のような条件分岐を入れない
- テスト用の特別な値(マジックナンバー)を本番コードに埋め込まない
- 環境変数や設定ファイルを使用して、テスト環境と本番環境を適切に分離すること

### テスト実装の原則
− テストが失敗する状態から始めること  (red-green-refator)
- 境界値、異常系、エラー系も必ずテストすること
- カバレッジだけでなく、通常の品質も意識すること 
- テストケース名は何をテストしているか、明確に記述すること

### 実装前の確認
- 機能の仕様を正しく理解してからテストを書くこと
- 不明な点があれば仮の実装ではなく、ユーザーに確認すること