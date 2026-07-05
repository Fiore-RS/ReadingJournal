import { useLibrary } from "../../context/LibraryContext.js";
import BookFormModal from "./BookFormModal.js";
import ChoiceModal from "./ChoiceModal.js";
import PickModal from "./PickModal.js";
import NewSeriesModal from "./NewSeriesModal.js";

export default function ModalRoot() {
  const {
    modal, setModal, closeModal, patchFormData, saveBookForm, confirmNewSeries,
    books, openAddBookModal, openPickModal, setStatus,
  } = useLibrary();

  if (!modal) return null;

  if (modal.type === "bookForm") {
    return (
      <BookFormModal
        key={modal.mode === "edit" ? modal.formData.id : "add"}
        mode={modal.mode}
        formData={modal.formData}
        onChange={patchFormData}
        onSave={saveBookForm}
        onClose={closeModal}
      />
    );
  }

  if (modal.type === "addChoice") {
    return (
      <ChoiceModal
        title="Add a Book to To Be Read"
        onNew={() => openAddBookModal("tbr")}
        onExisting={() =>
          openPickModal("Move a Book to To Be Read", (b) => b.status !== "tbr", (b) => {
            setStatus(b.id, "tbr");
            closeModal();
          })
        }
        onClose={closeModal}
      />
    );
  }

  if (modal.type === "pickExisting") {
    return (
      <PickModal
        title={modal.title}
        books={books}
        filterFn={modal.filterFn}
        onPick={modal.onPick}
        onClose={closeModal}
      />
    );
  }

  if (modal.type === "newSeries") {
    return (
      <NewSeriesModal
        name={modal.name}
        onChange={(name) => setModal((m) => (m && m.type === "newSeries" ? { ...m, name } : m))}
        onConfirm={confirmNewSeries}
        onClose={closeModal}
      />
    );
  }

  return null;
}
