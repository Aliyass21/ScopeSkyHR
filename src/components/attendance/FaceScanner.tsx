import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera, CameraOff, CheckCircle2, XCircle, Scan } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAttendanceStore } from '@/store/attendanceStore'

const CURRENT_EMPLOYEE_ID = 'EMP-0001'

type ScanState = 'idle' | 'active' | 'scanning' | 'success' | 'failed' | 'unavailable'

export const FaceScanner: React.FC = () => {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [scanState, setScanState] = useState<ScanState>('idle')
  const { clockIn } = useAttendanceStore()

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setScanState('active')
    } catch {
      setScanState('unavailable')
    }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setScanState('idle')
  }, [])

  const handleScan = useCallback(async () => {
    setScanState('scanning')
    // Simulate face recognition delay + always succeed for demo
    await new Promise((res) => setTimeout(res, 2000))

    const success = Math.random() > 0.1 // 90% success rate

    if (success) {
      setScanState('success')
      try {
        await clockIn(CURRENT_EMPLOYEE_ID)
        toast.success(t('attendance.success.clockedIn'))
      } catch {
        // already clocked in is ok
      }
      stopCamera()
    } else {
      setScanState('failed')
      toast.error(t('attendance.scanFailed'))
      setTimeout(() => setScanState('active'), 2000)
    }
  }, [clockIn, stopCamera, t])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Camera size={18} />
          {t('attendance.faceRecognition')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video preview */}
        <div
          className={cn(
            'relative aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center',
          )}
        >
          {(scanState === 'active' || scanState === 'scanning') && (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )}

          {scanState === 'idle' && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera size={40} />
              <p className="text-sm">{t('attendance.scanFace')}</p>
            </div>
          )}

          {scanState === 'unavailable' && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <CameraOff size={40} />
              <p className="text-sm">{t('attendance.cameraUnavailable')}</p>
              <p className="text-xs">{t('attendance.cameraPermission')}</p>
            </div>
          )}

          {scanState === 'scanning' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="flex flex-col items-center gap-2 text-white">
                <Scan size={40} className="animate-pulse" />
                <p className="text-sm">{t('attendance.scanning')}</p>
              </div>
            </div>
          )}

          {scanState === 'success' && (
            <div className="flex flex-col items-center gap-2 text-green-600">
              <CheckCircle2 size={40} />
              <p className="text-sm font-medium">{t('attendance.scanSuccess')}</p>
            </div>
          )}

          {scanState === 'failed' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="flex flex-col items-center gap-2 text-white">
                <XCircle size={40} className="text-red-400" />
                <p className="text-sm">{t('attendance.scanFailed')}</p>
              </div>
            </div>
          )}

          {/* Scan frame overlay */}
          {(scanState === 'active' || scanState === 'scanning') && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-40 w-32 rounded-full border-4 border-primary/60 opacity-70" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {scanState === 'idle' && (
            <Button className="flex-1" onClick={startCamera}>
              <Camera size={16} />
              {t('attendance.scanFace')}
            </Button>
          )}
          {scanState === 'active' && (
            <>
              <Button className="flex-1" onClick={handleScan}>
                <Scan size={16} />
                {t('attendance.scanFace')}
              </Button>
              <Button variant="outline" onClick={stopCamera}>
                {t('common.cancel')}
              </Button>
            </>
          )}
          {(scanState === 'unavailable' || scanState === 'success') && (
            <Button variant="outline" className="flex-1" onClick={() => setScanState('idle')}>
              {t('common.reset')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
