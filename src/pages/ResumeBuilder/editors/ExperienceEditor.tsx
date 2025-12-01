import { useState, useEffect } from "react";
import type { ExperienceSection, ResumeExperienceItem } from "../../../types/resume";
import { v4 as uuid } from "uuid";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

interface Props {
    section: ExperienceSection;
    onChange: (data: ExperienceSection["data"]) => void;
}

export default function ExperienceEditor({ section, onChange }: Props) {
    const [items, setItems] = useState<ResumeExperienceItem[]>(
        () => section.data?.items ?? []
    );

    useEffect(() => {
        setItems(section.data?.items ?? []);
    }, [section.id, section.data]);

    const syncAndUpdate = (updated: ResumeExperienceItem[]) => {
        setItems(updated);
        onChange({ items: updated });
    };

    const updateField = (
        index: number,
        field: keyof ResumeExperienceItem,
        value: string
    ) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        syncAndUpdate(updated);
    };

    const addItem = () => {
        const newItem: ResumeExperienceItem = {
            id: uuid(),
            company: "",
            role: "",
            period: "",
            description: "",
        };

        syncAndUpdate([...items, newItem]);
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
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="space-y-4"
                        >
                            {items.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="inner-card"
                                            style={{
                                                padding: "18px",
                                                borderRadius: "12px",
                                                border: "1px solid #ddd",
                                                position: "relative",
                                            }}
                                        >
                                            {/* Remove button */}
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="remove-btn"
                                                style={{
                                                    position: "absolute",
                                                    top: "10px",
                                                    right: "10px",
                                                    padding: "4px 10px",
                                                    borderRadius: "8px",
                                                    background: "#ff4d4d",
                                                    color: "white",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                Remove
                                            </button>

                                            <div
                                                className="section-header"
                                                style={{ marginBottom: 10 }}
                                            >
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                            fontSize: 16,
                                                        }}
                                                    >
                                                        {item.role || "Role"}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: 13,
                                                            opacity: 0.6,
                                                        }}
                                                    >
                                                        {item.company || "Company"}
                                                    </span>
                                                </div>

                                                {/* Drag handle */}
                                                <span
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        cursor: "grab",
                                                        opacity: 0.4,
                                                        fontSize: 20,
                                                    }}
                                                >
                                                    ☰
                                                </span>
                                            </div>

                                            <input
                                                className="round-input"
                                                placeholder="Company"
                                                value={item.company}
                                                onChange={(e) =>
                                                    updateField(index, "company", e.target.value)
                                                }
                                            />

                                            <input
                                                className="round-input"
                                                placeholder="Role / Position"
                                                value={item.role}
                                                onChange={(e) =>
                                                    updateField(index, "role", e.target.value)
                                                }
                                                style={{ marginTop: 8 }}
                                            />

                                            <input
                                                className="round-input"
                                                placeholder="Period"
                                                value={item.period}
                                                onChange={(e) =>
                                                    updateField(index, "period", e.target.value)
                                                }
                                                style={{ marginTop: 8 }}
                                            />

                                            <textarea
                                                className="round-input"
                                                placeholder="Description..."
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateField(index, "description", e.target.value)
                                                }
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
            <button
                type="button"
                className="purple-btn"
                style={{ width: "100%", marginTop: 10 }}
                onClick={addItem}
            >
                + Add Experience
            </button>
        </div>
    );
}

