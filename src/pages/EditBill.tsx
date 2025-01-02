import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const EditBill = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: bill, isLoading } = useQuery({
    queryKey: ["bill", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bills")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          title: "Error loading bill",
          description: "Could not load the bill details. Please try again.",
          variant: "destructive",
        });
        navigate("/bills");
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Bill Not Found</h1>
          <p className="text-muted-foreground">
            The bill you're trying to edit could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Bill</h1>
        </div>
        {/* We'll implement the edit form in a separate component */}
        <p className="text-center text-muted-foreground">
          Edit form implementation coming soon...
        </p>
      </div>
    </div>
  );
};

export default EditBill;