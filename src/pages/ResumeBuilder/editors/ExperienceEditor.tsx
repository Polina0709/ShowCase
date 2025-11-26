import { useState, useEffect } from "react";
import type { ExperienceSection, ResumeExperienceItem } from "../../../types/resume";
import { v4 as uuid } from "uuid";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

interface Props {
    section: ExperienceSection;
    onChange: (data: ExperienceSection["data"]) => void;
}

export default function ExperienceEditor({ section, onChange }: Props) {
    const [items, setItems] = useState<ResumeExperienceItem[]>(() => section.data?.items ?? []);

    useEffect(() => {
        setItems(section.data?.items ?? []);
    }, [section.id]);

    const [newItem, setNewItem] = useState<ResumeExperienceItem>({
        id: uuid(),
        company: "",
        role: "",
        period: "",
        description: "",
    });

    const syncAndUpdate = (updated: ResumeExperienceItem[]) => {
        setItems(updated);
        onChange({ items: updated });
    };

    const updateField = (index: number, field: keyof ResumeExperienceItem, value: string) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        syncAndUpdate(updated);
    };

    const addItem = () => {

        const itemToAdd: ResumeExperienceItem = {
            ...newItem,
            id: uuid(),
        };

        const updated = [...items, itemToAdd];
        syncAndUpdate(updated);

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
        syncAndUpdate(updated);
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const updated = [...items];
        const [moved] = updated.splice(result.source.index, 1);
        updated.splice(result.destination.index, 0, moved);
        syncAndUpdate(updated);
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
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="inner-card"
                                        >
                                            <div className="section-header">
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <span style={{ fontWeight: 600 }}>{item.role || "Role"}</span>
                                                    <span style={{ fontSize: 13, opacity: 0.6 }}>
                                                        {item.company || "Company"}
                                                    </span>
                                                </div>

                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <span
                                                        {...provided.dragHandleProps}
                                                        style={{ cursor: "grab", opacity: 0.4 }}
                                                    >
                                                        ☰
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="remove-btn"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            <input
                                                className="round-input"
                                                placeholder="Company"
                                                value={item.company}
                                                onChange={(e) => updateField(index, "company", e.target.value)}
                                                style={{ marginTop: 12 }}
                                            />

                                            <input
                                                className="round-input"
                                                placeholder="Role / Position"
                                                value={item.role}
                                                onChange={(e) => updateField(index, "role", e.target.value)}
                                                style={{ marginTop: 8 }}
                                            />

                                            <input
                                                className="round-input"
                                                placeholder="Period"
                                                value={item.period}
                                                onChange={(e) => updateField(index, "period", e.target.value)}
                                                style={{ marginTop: 8 }}
                                            />

                                            <textarea
                                                className="round-input"
                                                placeholder="Description..."
                                                value={item.description}
                                                onChange={(e) => updateField(index, "description", e.target.value)}
                                                style={{ marginTop: 8 }}
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
            <div className="inner-card">
                <h4 className="font-medium mb-2">Add New Experience</h4>

                <input
                    className="round-input mb-2"
                    placeholder="Company"
                    value={newItem.company}
                    onChange={(e) => setNewItem({ ...newItem, company: e.target.value })}
                />

                <input
                    className="round-input mb-2"
                    placeholder="Role / Position"
                    value={newItem.role}
                    onChange={(e) => setNewItem({ ...newItem, role: e.target.value })}
                />

                <input
                    className="round-input mb-2"
                    placeholder="Period"
                    value={newItem.period}
                    onChange={(e) => setNewItem({ ...newItem, period: e.target.value })}
                />

                <textarea
                    className="round-input mb-2"
                    placeholder="Description..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />

                <button
                    type="button"
                    className="purple-btn"
                    style={{ width: "100%", marginTop: 4 }}
                    onClick={addItem}
                >
                    + Add Experience
                </button>
            </div>
        </div>
    );
}

