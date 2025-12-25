import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileText, Upload, CheckCircle2, Clock, XCircle, Eye, Download, Trash2, Info, Plus, Image, File } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'AADHAAR' | 'PAN' | 'ADDRESS_PROOF' | 'PHOTO' | 'SIGNATURE' | 'OTHER';
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploaded_at: string;
  verified_at?: string;
  rejection_reason?: string;
  file_url?: string;
}

const mockDocuments: Document[] = [
  { id: '1', name: 'Aadhaar Card', type: 'AADHAAR', status: 'VERIFIED', uploaded_at: '2024-12-01', verified_at: '2024-12-02', file_url: '#' },
  { id: '2', name: 'PAN Card', type: 'PAN', status: 'VERIFIED', uploaded_at: '2024-12-01', verified_at: '2024-12-02', file_url: '#' },
  { id: '3', name: 'Address Proof - Electricity Bill', type: 'ADDRESS_PROOF', status: 'PENDING', uploaded_at: '2024-12-15', file_url: '#' },
  { id: '4', name: 'Passport Photo', type: 'PHOTO', status: 'REJECTED', uploaded_at: '2024-12-10', rejection_reason: 'Photo background not white', file_url: '#' },
  { id: '5', name: 'Signature', type: 'SIGNATURE', status: 'VERIFIED', uploaded_at: '2024-12-01', verified_at: '2024-12-02', file_url: '#' },
];

const documentTypeLabels: Record<string, string> = {
  AADHAAR: 'Aadhaar Card',
  PAN: 'PAN Card',
  ADDRESS_PROOF: 'Address Proof',
  PHOTO: 'Passport Photo',
  SIGNATURE: 'Signature',
  OTHER: 'Other Document',
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'VERIFIED': return <Badge className="badge-success"><CheckCircle2 className="h-3 w-3 mr-1" />Verified</Badge>;
    case 'PENDING': return <Badge className="badge-warning"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    case 'REJECTED': return <Badge className="badge-error"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'PHOTO': return Image;
    case 'SIGNATURE': return FileText;
    default: return File;
  }
};

const MyDocuments: React.FC = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (type: string) => {
    toast({
      title: 'Demo Mode',
      description: `Document upload for ${documentTypeLabels[type] || type} would open here`,
    });
  };

  const handleView = (doc: Document) => {
    toast({
      title: 'Demo Mode',
      description: `Viewing ${doc.name}`,
    });
  };

  const handleDelete = (doc: Document) => {
    setDocuments(prev => prev.filter(d => d.id !== doc.id));
    toast({
      title: 'Document Deleted',
      description: `${doc.name} has been removed`,
    });
  };

  const verifiedCount = documents.filter(d => d.status === 'VERIFIED').length;
  const pendingCount = documents.filter(d => d.status === 'PENDING').length;
  const rejectedCount = documents.filter(d => d.status === 'REJECTED').length;

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <span className="text-sm text-primary">Demo Mode: Displaying sample documents</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Documents</h1>
          <p className="text-muted-foreground">Upload and manage your identity documents</p>
        </div>
        <Button onClick={() => handleUpload('OTHER')}>
          <Plus className="h-4 w-4 mr-2" />Upload Document
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-success">{verifiedCount}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{pendingCount}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-destructive">{rejectedCount}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Required Documents */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>Upload these documents for vehicle registration and license applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['AADHAAR', 'PAN', 'ADDRESS_PROOF', 'PHOTO', 'SIGNATURE'].map((type) => {
              const doc = documents.find(d => d.type === type);
              return (
                <Card key={type} className={`glass-card-hover ${doc?.status === 'REJECTED' ? 'border-destructive/30' : doc?.status === 'VERIFIED' ? 'border-success/30' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${doc?.status === 'VERIFIED' ? 'bg-success/20 text-success' : doc?.status === 'REJECTED' ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                          {React.createElement(getDocumentIcon(type), { className: 'h-5 w-5' })}
                        </div>
                        <div>
                          <p className="font-medium">{documentTypeLabels[type]}</p>
                          {doc && <p className="text-xs text-muted-foreground">Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</p>}
                        </div>
                      </div>
                    </div>
                    {doc ? (
                      <div className="space-y-3">
                        {getStatusBadge(doc.status)}
                        {doc.rejection_reason && (
                          <p className="text-xs text-destructive mt-2">{doc.rejection_reason}</p>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(doc)}>
                            <Eye className="h-3 w-3 mr-1" />View
                          </Button>
                          {doc.status === 'REJECTED' && (
                            <Button variant="outline" size="sm" onClick={() => handleUpload(type)}>
                              <Upload className="h-3 w-3 mr-1" />Re-upload
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full" onClick={() => handleUpload(type)}>
                        <Upload className="h-4 w-4 mr-2" />Upload
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* All Documents List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
          <CardDescription>Complete list of your uploaded documents</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Documents</h3>
              <p className="text-muted-foreground mb-4">Upload your first document to get started</p>
              <Button onClick={() => handleUpload('OTHER')}>
                <Upload className="h-4 w-4 mr-2" />Upload Document
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc, index) => {
                const IconComponent = getDocumentIcon(doc.type);
                return (
                  <motion.div key={doc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${doc.status === 'VERIFIED' ? 'bg-success/20 text-success' : doc.status === 'REJECTED' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{documentTypeLabels[doc.type]} • Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                          {doc.rejection_reason && <p className="text-xs text-destructive mt-1">{doc.rejection_reason}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(doc.status)}
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleView(doc)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(doc)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyDocuments;
