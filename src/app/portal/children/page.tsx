"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useParentData } from "@/hooks/use-demo";
import { useAppStore } from "@/lib/store";
import { ageFromDob } from "@/lib/utils";

export default function ChildrenPage() {
  const { children } = useParentData();
  const addChild = useAppStore((s) => s.addChild);
  const removeChild = useAppStore((s) => s.removeChild);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "2014-01-01",
    gender: "male" as "male" | "female" | "other",
    notes: "",
    avatarColor: "#B8FF3C",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const child = addChild(form);
    if (!child) {
      toast.error("Could not add child");
      return;
    }
    toast.success(`${child.firstName} added`);
    setForm({
      firstName: "",
      lastName: "",
      dateOfBirth: "2014-01-01",
      gender: "male",
      notes: "",
      avatarColor: "#5AD1E8",
    });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Profiles</p>
          <h1 className="font-display text-4xl text-white">Children</h1>
          <p className="mt-2 text-sm text-white/50">
            Add athlete profiles to filter classes by age and book sessions.
          </p>
        </div>
        <Button onClick={() => setOpen((v) => !v)}>
          {open ? "Close form" : "Add child"}
        </Button>
      </div>

      {open && (
        <Card>
          <CardTitle>New child profile</CardTitle>
          <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>First name</Label>
              <Input
                required
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              />
            </div>
            <div>
              <Label>Last name</Label>
              <Input
                required
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              />
            </div>
            <div>
              <Label>Date of birth</Label>
              <Input
                type="date"
                required
                value={form.dateOfBirth}
                onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
              />
            </div>
            <div>
              <Label>Gender</Label>
              <Select
                value={form.gender}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    gender: e.target.value as "male" | "female" | "other",
                  }))
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Prefer not to say</option>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Goals, sports, medical notes for coaches…"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Save profile</Button>
            </div>
          </form>
        </Card>
      )}

      {children.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No children yet"
          description="Add your first child profile to unlock booking and programme enrolment."
          actionLabel="Add child"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {children.map((child) => (
            <Card key={child.id} className="overflow-hidden">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl font-display text-2xl text-[var(--accent-ink)]"
                  style={{ background: child.avatarColor }}
                >
                  {child.firstName[0]}
                  {child.lastName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-2xl text-white">
                    {child.firstName} {child.lastName}
                  </h3>
                  <p className="text-sm text-white/50">
                    Age {ageFromDob(child.dateOfBirth)} · Born {child.dateOfBirth}
                  </p>
                  {child.notes && (
                    <p className="mt-2 text-sm text-white/65">{child.notes}</p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-[var(--danger)]"
                    onClick={() => {
                      removeChild(child.id);
                      toast.message("Child profile removed");
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
