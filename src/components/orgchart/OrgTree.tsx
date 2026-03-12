import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { OrgNodeCard } from './OrgNodeCard'
import type { OrgNodeData } from '@/types/orgchart'

interface OrgTreeProps {
  node: OrgNodeData
  selectedId: string | null
  onSelect: (node: OrgNodeData) => void
}

export const OrgTree: React.FC<OrgTreeProps> = ({ node, selectedId, onSelect }) => {
  const [collapsed, setCollapsed] = useState(false)
  const hasChildren = node.children.length > 0

  return (
    <div className="flex flex-col items-center">
      <OrgNodeCard
        node={node}
        selected={selectedId === node.id}
        onSelect={() => onSelect(node)}
      />

      {/* Collapse toggle */}
      {hasChildren && (
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="h-5 w-5 rounded-full border bg-card flex items-center justify-center shadow-sm hover:bg-muted z-10 relative mt-0.5"
          style={{ marginBottom: collapsed ? 0 : undefined }}
        >
          {collapsed
            ? <ChevronDown size={10} className="text-muted-foreground" />
            : <ChevronUp size={10} className="text-muted-foreground" />
          }
        </button>
      )}

      {hasChildren && !collapsed && (
        <>
          {/* Vertical connector from toggle to horizontal bar */}
          <div className="w-px h-4 bg-border" />

          {/* Children row with CSS connectors */}
          <div className="org-children">
            {node.children.map((child) => (
              <div key={child.id} className="org-branch">
                <OrgTree node={child} selectedId={selectedId} onSelect={onSelect} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
