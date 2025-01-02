import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type BillAttachmentProps = {
  attachment: string | null;
  billId: string;
};

export const BillAttachment = ({ attachment, billId }: BillAttachmentProps) => {
  const { toast } = useToast();

  const handleViewAttachment = async () => {
    try {
      const { data } = await supabase.storage
        .from("bill-attachments")
        .createSignedUrl(`${billId}/${attachment}`, 3600); // 1 hour expiration

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      } else {
        throw new Error('Could not generate signed URL');
      }
    } catch (error) {
      console.error('View attachment error:', error);
      toast({
        title: "Error",
        description: "Failed to view attachment",
        variant: "destructive",
      });
    }
  };

  if (!attachment) return null;

  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">Attachment</p>
      <Button
        variant="outline"
        onClick={handleViewAttachment}
        className="gap-2"
      >
        <FileIcon className="h-4 w-4" />
        View Attachment
      </Button>
    </>
  );
};