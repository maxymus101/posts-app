import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from "formik";

import css from "./CreatePostForm.module.css";
import { CreatePost } from "../../services/postService";

interface PostFormProps {
  onSubmit: (inputData: CreatePost | null) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

const initialValues: CreatePost = {
  title: "",
  content: "",
};

const CreatePostSchema = Yup.object().shape({
  title: Yup.string().trim().max(50, "Title is too long").required("Please enter title"),
  content: Yup.string().required("Oppss. No content found"),
});

export default function PostForm({ onClose, onSubmit, isSubmitting = false }: PostFormProps) {
  const handleSubmit = (values: CreatePost, actions: FormikHelpers<CreatePost>) => {
    actions.resetForm();
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={CreatePostSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field id="content" as="textarea" name="content" rows={8} className={css.textarea} />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isSubmitting}>
            Create post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
