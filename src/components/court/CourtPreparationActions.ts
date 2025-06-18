import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Types
export type ChecklistItem = {
  id: string;
  task: string;
  completed: boolean;
  dueDate: string;
};

export type EvidenceItem = {
  id: string;
  name: string;
  type: string;
  status: string;
  added: string;
  prepared: boolean;
};

export type DocumentItem = {
  id: string;
  title: string;
  type: string;
  created: string;
  status: string;
};

export const useCourtPreparationActions = () => {
  const navigate = useNavigate();

  // Checklist actions
  const toggleChecklistItem = (
    items: ChecklistItem[],
    setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    itemId: string
  ) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setItems(updatedItems);

    const item = items.find((i) => i.id === itemId);
    if (item) {
      toast({
        title: item.completed ? "Task Unmarked" : "Task Completed",
        description: item.task,
      });
    }
  };

  const addChecklistItem = (
    items: ChecklistItem[],
    setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    task: string,
    dueDate: string
  ) => {
    const newItem: ChecklistItem = {
      id: `CL-${String(items.length + 1).padStart(3, "0")}`,
      task,
      completed: false,
      dueDate,
    };

    setItems([...items, newItem]);
    toast({
      title: "Task Added",
      description: `Added "${task}" to your checklist`,
    });
  };

  // Evidence actions
  const prepareEvidence = (
    items: EvidenceItem[],
    setItems: React.Dispatch<React.SetStateAction<EvidenceItem[]>>,
    evidenceId: string
  ) => {
    const updatedItems = items.map((item) =>
      item.id === evidenceId ? { ...item, prepared: true } : item
    );
    setItems(updatedItems);

    const item = items.find((i) => i.id === evidenceId);
    if (item) {
      toast({
        title: "Evidence Prepared",
        description: `${item.name} is now ready for court`,
      });
    }
  };

  const previewEvidence = (evidence: EvidenceItem) => {
    toast({
      title: "Evidence Preview",
      description: `Previewing ${evidence.name}`,
    });
    // In a real implementation, this would open an evidence preview
  };

  const downloadEvidence = (evidence: EvidenceItem) => {
    toast({
      title: "Downloading Evidence",
      description: `Started downloading ${evidence.name}`,
    });
    // In a real implementation, this would download the evidence
  };

  const preparePresentation = () => {
    toast({
      title: "Creating Presentation",
      description: "Starting evidence presentation creation",
    });
    // In a real implementation, this would open a presentation creation tool
  };

  // Document actions
  const viewDocument = (document: DocumentItem) => {
    toast({
      title: "Viewing Document",
      description: `Opening ${document.title}`,
    });
    // In a real implementation, this would open the document
  };

  const editDocument = (document: DocumentItem) => {
    navigate("/legal/documentation");
    toast({
      title: "Edit Document",
      description: `Ready to edit ${document.title}`,
    });
  };

  const downloadDocument = (document: DocumentItem) => {
    toast({
      title: "Downloading Document",
      description: `Started downloading ${document.title}`,
    });
    // In a real implementation, this would download the document
  };

  const createDocument = (documentType: string) => {
    navigate("/legal/documentation");
    toast({
      title: "Create Document",
      description: `Ready to create a new ${documentType}`,
    });
  };

  // Witness preparation
  const scheduleWitnessMeeting = () => {
    toast({
      title: "Schedule Witness Preparation",
      description: "Opening scheduling tool",
    });
    // In a real implementation, this would open a scheduling interface
  };

  const viewPreparationNotes = () => {
    toast({
      title: "Viewing Preparation Notes",
      description: "Opening witness preparation notes",
    });
    // In a real implementation, this would show preparation notes
  };

  const viewExpertReport = () => {
    toast({
      title: "Viewing Expert Report",
      description: "Opening expert witness report",
    });
    // In a real implementation, this would show the report
  };

  const viewWitnessStatements = () => {
    toast({
      title: "Viewing Witness Statements",
      description: "Opening collected witness statements",
    });
    // In a real implementation, this would show the statements
  };

  // Strategy actions
  const updateStrategyBrief = () => {
    toast({
      title: "Update Strategy Brief",
      description: "Opening strategy brief editor",
    });
    // In a real implementation, this would open a strategy editor
  };

  const viewStrategyDocument = (documentName: string) => {
    toast({
      title: "Viewing Strategy Document",
      description: `Opening ${documentName}`,
    });
    // In a real implementation, this would open the document
  };

  // Report generation
  const generateChainOfCustodyReport = () => {
    toast({
      title: "Generating Report",
      description: "Creating chain of custody report",
    });
    // In a real implementation, this would generate a report
  };

  const generateProgressReport = () => {
    toast({
      title: "Generating Progress Report",
      description: "Creating court preparation progress report",
    });
    // In a real implementation, this would generate a report
  };

  // Navigation actions
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return {
    toggleChecklistItem,
    addChecklistItem,
    prepareEvidence,
    previewEvidence,
    downloadEvidence,
    preparePresentation,
    viewDocument,
    editDocument,
    downloadDocument,
    createDocument,
    scheduleWitnessMeeting,
    viewPreparationNotes,
    viewExpertReport,
    viewWitnessStatements,
    updateStrategyBrief,
    viewStrategyDocument,
    generateChainOfCustodyReport,
    generateProgressReport,
    navigateTo,
  };
};
