import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

import css from "./EditPostForm.module.css";
import { PatchPost } from "../../services/postService";

interface EditPostFormProps {
  onClose: () => void;
  onSubmit: (inputData: PatchPost | null) => void;
  initialValues: PatchPost;
}

const EditPostSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(3, "Title is too short!")
    .max(50, "Title is too long!")
    .required("Please enter title."),
  body: Yup.string().max(500, "Content is too long!").required("Oppss. No content found."),
});
export default function EditPostForm({ onClose, onSubmit, initialValues }: EditPostFormProps) {
  const handleSubmit = (values: PatchPost, actions: FormikHelpers<PatchPost>) => {
    actions.resetForm();
    onSubmit(values);
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={EditPostSchema}
      enableReinitialize
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" onClick={onClose} className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
