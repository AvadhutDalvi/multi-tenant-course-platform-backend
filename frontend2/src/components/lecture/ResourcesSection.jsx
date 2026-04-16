import MaterialsList from "./MaterialsList";
import PracticeSheet from "./PracticeSheet";

function ResourcesSection(props) {
  return (
    <section className="rounded-[30px] bg-white px-6 py-6 shadow-[0_10px_32px_rgba(17,24,39,0.04)] ring-1 ring-[#F0F2F7] sm:px-7 sm:py-7">
      <div className="mb-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#A3ACC1]">
          Supporting Files
        </p>
        <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#111827]">
          Resources
        </h2>
      </div>

      <div className="space-y-6">
        <MaterialsList
          materials={props.materials}
          onAddMaterial={props.onAddMaterial}
          onRemoveMaterial={props.onRemoveMaterial}
          onMaterialFieldChange={props.onMaterialFieldChange}
          onMaterialFileChange={props.onMaterialFileChange}
        />

        <PracticeSheet
          practiceSheet={props.practiceSheet}
          onFieldChange={props.onPracticeSheetFieldChange}
          onFileChange={props.onPracticeSheetFileChange}
        />
      </div>
    </section>
  );
}

export default ResourcesSection;
