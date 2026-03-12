import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface OrgZoomControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

export const OrgZoomControls: React.FC<OrgZoomControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-0.5 bg-card border rounded-lg p-0.5 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onZoomOut}
        disabled={zoom <= 0.4}
        title={t('orgchart.zoomOut')}
      >
        <ZoomOut size={14} />
      </Button>
      <span className="text-xs w-10 text-center text-muted-foreground font-mono select-none">
        {Math.round(zoom * 100)}%
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onZoomIn}
        disabled={zoom >= 2}
        title={t('orgchart.zoomIn')}
      >
        <ZoomIn size={14} />
      </Button>
      <div className="w-px h-4 bg-border mx-0.5" />
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onReset}
        title={t('orgchart.zoomReset')}
      >
        <Maximize2 size={14} />
      </Button>
    </div>
  )
}
