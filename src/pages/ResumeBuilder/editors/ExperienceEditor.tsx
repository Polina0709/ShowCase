import type { ExperienceSection, ResumeExperienceItem } from "../../../types/resume";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

interface Props {
    section: ExperienceSection;
    onChange: (data: ExperienceSection["data"]) => void;
}

export default function ExperienceEditor({ section, onChange }: Props) {
    const items: ResumeExperienceItem[] = section.data?.items ?? [];

    const [newItem, setNewItem] = useState<ResumeExperienceItem>({
        id: uuid(),
        company: "",
        role: "",
        period: "",
        description: "",
    });

    const updateField = (index: number, field: keyof ResumeExperienceItem, value: string) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ items: updated });
    };

    const addItem = () => {
        if (!newItem.company.trim() || !newItem.role.trim()) return;

        const updated = [...items, newItem];
        onChange({ items: updated });

        setNewItem({
            id: uuid(),
            company: "",
            role: "",
            period: "",
            description: "",
        });
    };

    const removeItem = (index: number) => {
        const updated = items.filter((_, i) => i !== index);
        onChange({ items: updated });
    };

    /** ✅ Drag & Drop reorder */
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const updated = [...items];
        const [moved] = updated.splice(result.source.index, 1);
        updated.splice(result.destination.index, 0, moved);

        onChange({ items: updated });
    };

    return (
        <div className="space-y-6">

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="experience-items">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">

                            {items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                        <div
                                            className="border rounded p-4 bg-gray-50 shadow-sm"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.role}</span>
                                                    <span className="text-sm text-gray-600">{item.company}</span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span
                                                        {...provided.dragHandleProps}
                                                        className="cursor-grab text-gray-400"
                                                    >
                                                        ☰
                                                    </span>
                                                    <button
                                                        onClick={() => removeItem(index)}
                                                        className="text-red-500 text-sm hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            <input
                                                className="input mt-3"
                                                placeholder="Company"
                                                value={item.company}
                                                onChange={(e) => updateField(index, "company", e.target.value)}
                                            />

                                            <input
                                                className="input mt-2"
                                                placeholder="Role"
                                                value={item.role}
                                                onChange={(e) => updateField(index, "role", e.target.value)}
                                            />

                                            <input
                                                className="input mt-2"
                                                placeholder="Period"
                                                value={item.period}
                                                onChange={(e) => updateField(index, "period", e.target.value)}
                                            />

                                            <textarea
                                                className="input mt-2"
                                                placeholder="Description..."
                                                value={item.description}
                                                onChange={(e) => updateField(index, "description", e.target.value)}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Add new experience */}
            <div className="border border-dashed rounded p-4">
                <h4 className="font-medium mb-2">Add New Experience</h4>

                <input
                    className="input mb-2"
                    placeholder="Company"
                    value={newItem.company}
                    onChange={(e) => setNewItem({ ...newItem, company: e.target.value })}
                />

                <input
                    className="input mb-2"
                    placeholder="Role / Position"
                    value={newItem.role}
                    onChange={(e) => setNewItem({ ...newItem, role: e.target.value })}
                />

                <input
                    className="input mb-2"
                    placeholder="Period"
                    value={newItem.period}
                    onChange={(e) => setNewItem({ ...newItem, period: e.target.value })}
                />

                <textarea
                    className="input mb-2"
                    placeholder="Description..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                    onClick={addItem}
                >
                    + Add Experience
                </button>
            </div>
        </div>
    );
}
