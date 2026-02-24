import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Label } from "@/app/components/ui/label";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  getLeadProjects,
  applyCvToProject,
} from "@/services/leadservice/lead.api";
import { toast } from "sonner";

interface Project {
  name: string;
  description: string;
  role?: string;
  technologies?: string[];
}

interface CvDetail {
  id: number;
  title: string;
  description?: string;

  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;

  education?: string;
  experience?: string;
  careerGoal?: string;
  additionalInfo?: string;

  projects?: Project[];
  skills?: string[];
}

interface CvDetailDialogProps {
  open: boolean;
  onClose: () => void;
  data: CvDetail | null;
}

const CvDetailDialog: React.FC<CvDetailDialogProps> = ({
  open,
  onClose,
  data,
}) => {
  if (!data) return null;
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchProjects = async () => {
      try {
        const res = await getLeadProjects(0, 100);
        setProjects(res.content);
      } catch {
        toast.error("Không tải được danh sách project");
      }
    };

    fetchProjects();
  }, [open]);

  const handleApply = async () => {
    if (!selectedProjectId) {
      toast.error("Vui lòng chọn project");
      return;
    }

    try {
      setLoading(true);

      await applyCvToProject(selectedProjectId, {
        cvId: data.id,
      });

      toast.success("Apply thành công");
      onClose();
    } catch {
      toast.error("Apply thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết CV</DialogTitle>
        </DialogHeader>

        <div className="flex gap-3 items-center mb-4">
          <select
            value={selectedProjectId ?? ""}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg w-64"
          >
            <option value="">Chọn project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <Button onClick={handleApply} disabled={loading}>
            {loading ? "Đang apply..." : "Apply"}
          </Button>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Thông tin</TabsTrigger>
            <TabsTrigger value="projects">Dự án</TabsTrigger>
            <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
          </TabsList>

          {/* ================= PERSONAL ================= */}
          <TabsContent value="personal" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Họ và tên</Label>
                    <p className="mt-1 text-gray-700">{data.fullName || "-"}</p>
                  </div>

                  <div>
                    <Label>Email</Label>
                    <p className="mt-1 text-gray-700">{data.email || "-"}</p>
                  </div>

                  <div>
                    <Label>Số điện thoại</Label>
                    <p className="mt-1 text-gray-700">{data.phone || "-"}</p>
                  </div>

                  <div>
                    <Label>Địa chỉ</Label>
                    <p className="mt-1 text-gray-700">{data.address || "-"}</p>
                  </div>
                </div>

                <div>
                  <Label>Học vấn</Label>
                  <p className="mt-1 text-gray-700 whitespace-pre-line">
                    {data.education || "-"}
                  </p>
                </div>

                <div>
                  <Label>Kinh nghiệm</Label>
                  <p className="mt-1 text-gray-700 whitespace-pre-line">
                    {data.experience || "-"}
                  </p>
                </div>

                <div>
                  <Label>Mục tiêu nghề nghiệp</Label>
                  <p className="mt-1 text-gray-700 whitespace-pre-line">
                    {data.careerGoal || "-"}
                  </p>
                </div>

                <div>
                  <Label>Thông tin bổ sung</Label>
                  <p className="mt-1 text-gray-700 whitespace-pre-line">
                    {data.additionalInfo || "-"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= PROJECTS ================= */}
          <TabsContent value="projects" className="space-y-4 mt-6">
            {data.projects && data.projects.length > 0 ? (
              data.projects.map((project, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{project.name}</h3>

                      {project.role && (
                        <p className="text-sm text-primary">
                          Vai trò: {project.role}
                        </p>
                      )}

                      {project.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, i) => (
                            <Badge key={i} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p className="text-gray-600 mt-2">
                        {project.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">Chưa có dự án</p>
            )}
          </TabsContent>

          {/* ================= SKILLS ================= */}
          <TabsContent value="skills" className="space-y-4 mt-6">
            {data.skills && data.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Chưa có kỹ năng</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CvDetailDialog;
