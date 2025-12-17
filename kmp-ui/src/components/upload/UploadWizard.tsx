/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { uploadSchema, UploadFormData } from "@/app/upload/schema";
import StepFiles from "./StepFiles";
import StepMetadata from "./StepMetadata";
import StepReview from "./StepReview";
import WizardSteps from "./WizardSteps";
import { useCategories } from "@/hooks/useCategories";
import { useDepartments } from "@/hooks/useDepartments";
import { fetchTags } from "@/hooks/useSearchTags";

type Option = {
  id: number | string;
  name: string;
};

export default function UploadWizard() {
  const [step, setStep] = useState(1);
  const [allTags, setAllTags] = useState([]);

  const methods = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    mode: "onChange",
    defaultValues: { files: [], tags: [] },
  });

  /** ---------------- FETCH USING QUERY ---------------- **/
  const {
    data: categoryData = [],
    isLoading: catLoading,
    isError: catError,
  } = useCategories();

  const {
    data: departmentData = [],
    isLoading: depLoading,
    isError: depError,
  } = useDepartments();

  /** ---------------- MAPPED SELECT OPTIONS ---------------- **/
  const categories = categoryData.map((c: Option) => ({
    value: c.id,
    label: `${c.name}`,
  }));

  const departments = departmentData.map((d: Option) => ({
    value: d.id,
    label: d.name,
  }));

  /** --------- LOAD ALL TAGS ON MOUNT --------- */
  useEffect(() => {
    async function load() {
      const tags = await fetchTags("");
      setAllTags(
        tags.map((t: any) => ({
          value: t.id,
          label: t.name,
        }))
      );
    }
    load();
  }, []);

  return (
    <FormProvider {...methods}>
      <WizardSteps step={step} setStep={setStep} />

      {step === 1 && <StepFiles onNext={() => setStep(2)} />}
      {step === 2 && (
        <StepMetadata
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
          allTags={allTags}
          categories={categories}
          departments={departments}
          catLoading={catLoading}
          catError={catError}
          depLoading={depLoading}
          depError={depError}
        />
      )}
      {step === 3 && (
        <StepReview
          onBack={() => setStep(2)}
          allTags={allTags}
          categories={categories}
          departments={departments}
        />
      )}
    </FormProvider>
  );
}
