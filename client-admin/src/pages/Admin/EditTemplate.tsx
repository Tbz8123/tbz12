import React, { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SnapTemplateEditor from "./SnapTemplateEditor";

export default function EditTemplate() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: template, isLoading } = useQuery({
    queryKey: ["/api/templates", id],
    queryFn: async () => {
      const res = await fetch(`/api/templates/${id}`);
      if (!res.ok) throw new Error("Failed to fetch template");
      return res.json();
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async (updated: any) => {
      await fetch(`/api/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/templates", id] });
      setTimeout(() => {
        window.location.href = "/admin/templates";
      }, 200);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!template) return <div>Template not found</div>;

  return (
    <SnapTemplateEditor
      initialData={template}
      onSave={updateMutation.mutate}
      isEditing
    />
  );
}
