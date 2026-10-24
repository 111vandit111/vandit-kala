import React from "react";
import { notFound } from "next/navigation";
import ResourceManager from "../../../../lib/admin/ResourceManager";
import { RESOURCES, type Resource } from "../../../../lib/server/limits";

const isResource = (value: string): value is Resource => (RESOURCES as string[]).includes(value);

const AdminResourcePage = async ({ params }: { params: Promise<{ resource: string }> }) => {
  const { resource } = await params;
  if (!isResource(resource)) notFound();
  return <ResourceManager key={resource} resource={resource} />;
};

export default AdminResourcePage;
