import React, { useCallback } from "react";
/** icons **/
import CheckIcon from "../icon/check";
import ClearIcon from "../icon/clear";
/** styles **/
import styles from "./file-list.module.css";

interface FilesListItemProps {
  name: string;
  id: string;
  onClear: (id: string) => void;
  uploadComplete: boolean;
}

const FilesListItem: React.FC<FilesListItemProps> = ({
  name,
  id,
  onClear,
  uploadComplete,
}) => {
  const handleClear = useCallback(() => {
    onClear(id);
  }, []);

  return (
    <li className={styles.files_list_item}>
      <span className={styles.files_list_item_name}>{name}</span>
      {!uploadComplete ? (
        <span
          className={styles.files_list_item_clear}
          role="button"
          aria-label="remove file"
          onClick={handleClear}
        >
          <ClearIcon />
        </span>
      ) : (
        <span role="img" className={styles.file_list_item_check}>
          <CheckIcon />
        </span>
      )}
    </li>
  );
};

interface FileListProps {
  files: { file: File; id: string }[];
  onClear: (id: string) => void;
  uploadComplete: boolean;
}
const FilesList: React.FC<FileListProps> = ({
  files,
  onClear,
  uploadComplete,
}) => {
  console.log("files", files);
  return (
    <ul className={styles.files_list}>
      {files.map(({ file, id }) => (
        <FilesListItem
          name={file.name}
          key={id}
          id={id}
          onClear={onClear}
          uploadComplete={uploadComplete}
        />
      ))}
    </ul>
  );
};

export { FilesList };
