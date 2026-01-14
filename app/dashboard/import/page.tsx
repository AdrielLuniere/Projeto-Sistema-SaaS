"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { createWorker } from "tesseract.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { parseBoletoText } from "@/lib/ocr-parser"
import { Loader2, UploadCloud } from "lucide-react"

export default function ImportPage() {
    const [progress, setProgress] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const [result, setResult] = useState<any>(null)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        setIsProcessing(true)
        setProgress(0)
        setResult(null)

        try {
            const worker = await createWorker("eng") // 'por' requires downloading specialized language data, sticking to eng for caching demo
            // In prod: await createWorker('por')
            
            const ret = await worker.recognize(file);
            console.log(ret.data.text);
            
            const parsed = parseBoletoText(ret.data.text)
            setResult(parsed)

            await worker.terminate();
        } catch (err) {
            console.error(err)
        } finally {
            setIsProcessing(false)
            setProgress(100)
        }

    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg'],
            'application/pdf': ['.pdf'] // Note: Tesseract JS has limited direct PDF support in browser without configuring worker core. Images are safer for demo.
        }
    })

    return (
        <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Import Boletos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload File</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div 
                            {...getRootProps()} 
                            className={`
                                border-2 border-dashed rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer transition-colors
                                ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"}
                            `}
                        >
                            <input {...getInputProps()} />
                            <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                            {isDragActive ? (
                                <p>Drop the files here ...</p>
                            ) : (
                                <p className="text-center text-muted-foreground">
                                    Drag 'n' drop some files here, or click to select files<br/>
                                    <span className="text-xs">(Images work best for client-side OCR)</span>
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Extraction Result</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isProcessing && (
                            <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Processing image via OCR...</p>
                            </div>
                        )}

                        {!isProcessing && !result && (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                Create an upload to see results.
                            </div>
                        )}

                        {result && (
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-md border text-sm space-y-2">
                                    <p><strong>Barcode:</strong> {result.barcode || "Not found"}</p>
                                    <p><strong>Amount:</strong> {result.amount ? `R$ ${result.amount.toFixed(2)}` : "Not found"}</p>
                                    <p><strong>Due Date:</strong> {result.dueDate ? result.dueDate.toLocaleDateString() : "Not found"}</p>
                                </div>
                                <h4 className="font-semibold text-xs uppercase text-muted-foreground">Raw Text</h4>
                                <pre className="text-xs bg-slate-900 text-slate-50 p-4 rounded-md overflow-auto max-h-[200px]">
                                    {result.rawText}
                                </pre>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
