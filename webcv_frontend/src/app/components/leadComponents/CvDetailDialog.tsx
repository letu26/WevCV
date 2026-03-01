import React, { useEffect, useState } from "react";
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
import { Button } from "@/app/components/ui/button";
import {
  getLeadProjects,
  applyCvToProject,
} from "@/services/leadservice/lead.api";
import { toast } from "sonner";

/* ================= TYPES ================= */

interface Skill {
  id: string;
  name: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  major: string;
  start: string;
  end: string;
  description: string;
}

interface Job {
  id: string;
  company: string;
  position: string;
  start: string;
  end: string;
  description: string;
}

interface Certificate {
  id: string;
  name: string;
  time: string;
}

interface Award {
  id: string;
  name: string;
  time: string;
}

interface Activity {
  id: string;
  organization: string;
  role: string;
  start: string;
  end: string;
  description: string;
}

interface CvDetail {
  id: number;
  title: string;
  fullName: string;
  position: string;
  avatar: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  gender: string;
  longTerm: string;
  shortTerm: string;
  skills: Skill[];
  educations: Education[];
  jobs: Job[];
  certificates: Certificate[];
  awards: Award[];
  activities: Activity[];
}

interface CvDetailDialogProps {
  open: boolean;
  onClose: () => void;
  data: any; // nhận full response
}

/* ================= COMPONENT ================= */

const CvDetailDialog: React.FC<CvDetailDialogProps> = ({
  open,
  onClose,
  data,
}) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
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

  if (!data) return null;
  
  const cv: CvDetail = data;
  console.log(data);
  console.log("Dialog render");
console.log("open:", open);
console.log("data:", data);

  const handleApply = async () => {
    if (!selectedProjectId) {
      toast.error("Vui lòng chọn project");
      return;
    }

    try {
      setLoading(true);

      await applyCvToProject(selectedProjectId, {
        cvId: cv.id,
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
          <DialogTitle>{cv.title}</DialogTitle>
        </DialogHeader>

        {/* APPLY */}
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

        <Tabs defaultValue="personal">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Thông tin</TabsTrigger>
            <TabsTrigger value="experience">Kinh nghiệm</TabsTrigger>
            <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
            <TabsTrigger value="more">Khác</TabsTrigger>
          </TabsList>

          {/* ================= PERSONAL ================= */}
          <TabsContent value="personal" className="mt-6 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">

                <div className="flex gap-6 items-center">
                  <img
                    src={cv.avatar}
                    className="w-32 h-32 rounded-full object-cover border"
                  />
                  <div>
                    <h2 className="text-xl font-bold">{cv.fullName}</h2>
                    <p className="text-gray-600">{cv.position}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <p><strong>Email:</strong> {cv.email}</p>
                  <p><strong>Phone:</strong> {cv.phone}</p>
                  <p><strong>Address:</strong> {cv.address}</p>
                  <p><strong>DOB:</strong> {cv.dob}</p>
                  <p><strong>Gender:</strong> {cv.gender}</p>
                </div>

                <div>
                  <Label>Mục tiêu dài hạn</Label>
                  <p>{cv.longTerm}</p>
                </div>

                <div>
                  <Label>Mục tiêu ngắn hạn</Label>
                  <p>{cv.shortTerm}</p>
                </div>

                <div>
                  <Label>Học vấn</Label>
                  {cv.educations?.map((edu) => (
                    <div key={edu.id} className="mt-3">
                      <p className="font-semibold">
                        {edu.school} - {edu.major}
                      </p>
                      <p className="text-sm text-gray-500">
                        {edu.start} - {edu.end}
                      </p>
                      <p>{edu.description}</p>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= EXPERIENCE ================= */}
          <TabsContent value="experience" className="mt-6 space-y-4">
            {cv.jobs?.map((job) => (
              <Card key={job.id}>
                <CardContent className="pt-6">
                  <p className="font-semibold">
                    {job.company} - {job.position}
                  </p>
                  <p className="text-sm text-gray-500">
                    {job.start} - {job.end}
                  </p>
                  <p className="mt-2">{job.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* ================= SKILLS ================= */}
          <TabsContent value="skills" className="mt-6">
            {cv.skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {cv.skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p>Chưa có kỹ năng</p>
            )}
          </TabsContent>

          {/* ================= MORE ================= */}
          <TabsContent value="more" className="mt-6 space-y-6">

            <div>
              <Label>Chứng chỉ</Label>
              {cv.certificates?.map((c) => (
                <p key={c.id}>{c.name} ({c.time})</p>
              ))}
            </div>

            <div>
              <Label>Giải thưởng</Label>
              {cv.awards?.map((a) => (
                <p key={a.id}>{a.name} ({a.time})</p>
              ))}
            </div>

            <div>
              <Label>Hoạt động</Label>
              {cv.activities?.map((a) => (
                <div key={a.id} className="mt-2">
                  <p className="font-semibold">
                    {a.organization} - {a.role}
                  </p>
                  <p className="text-sm text-gray-500">
                    {a.start} - {a.end}
                  </p>
                  <p>{a.description}</p>
                </div>
              ))}
            </div>

          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CvDetailDialog;