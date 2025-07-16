import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SheetIcon } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

const HtmlLegend = () => {
  return (
    <div className='grid gap-8 grid-cols-2'>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    HTML formatting Legend
                </CardTitle>
                <SheetIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-between">
            <Table className="w-full border shadow-sm">
                <TableHeader>
                    <TableRow >
                    <TableHead className="font-bold text-left">Tag</TableHead>
                    <TableHead className="font-bold text-left">Usage Example</TableHead>
                    <TableHead className="font-bold text-left">Description</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                <TableRow>
                    <TableCell className="font-mono" >&lt;h1&gt; - &lt;h6&gt;</TableCell>
                    <TableCell><code>&lt;h1&gt;Heading&lt;/h1&gt;</code></TableCell>
                    <TableCell>Headings (H1 is largest, H6 is smallest)</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-mono ">&lt;p&gt;</TableCell>
                    <TableCell><code>&lt;p&gt;This is a paragraph.&lt;/p&gt;</code></TableCell>
                    <TableCell>Paragraphs</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-mono ">&lt;strong&gt;</TableCell>
                    <TableCell><code>&lt;strong&gt;Bold&lt;/strong&gt;</code></TableCell>
                    <TableCell>Bold text</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-mono ">&lt;em&gt;</TableCell>
                    <TableCell><code>&lt;em&gt;Italic&lt;/em&gt;</code></TableCell>
                    <TableCell>Italic text</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-mono ">&lt;u&gt;</TableCell>
                    <TableCell><code>&lt;u&gt;Underlined&lt;/u&gt;</code></TableCell>
                    <TableCell>Underline text</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-mono ">&lt;br&gt;</TableCell>
                    <TableCell><code>Line 1&lt;br&gt;Line 2</code></TableCell>
                    <TableCell>Line break (new line)</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-mono ">&lt;hr&gt;</TableCell>
                    <TableCell><code>&lt;hr&gt;</code></TableCell>
                    <TableCell>Horizontal line</TableCell>
                </TableRow>
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    </div>
  )
}

export default HtmlLegend;