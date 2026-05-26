function FieldLabel({ children }) {
  return (
    <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
      {children}
    </span>
  );
}

function InputField(props) {
  return (
    <input
      {...props}
      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
    />
  );
}

function LectureBasicsSection({ formData, setFormData }) {

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <section id="basics" className="scroll-mt-28 rounded-[30px] border border-white/80 bg-white px-6 py-7 shadow-[0_16px_42px_rgba(15,23,42,0.05)] sm:px-7">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">
          Section 01
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          Lecture Basics
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_180px_160px]">
        <label className="block lg:col-span-3">
          <FieldLabel>Lecture Title</FieldLabel>
          <InputField
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            placeholder="Lecture title"
          />
        </label>

        <label className="block">
          <FieldLabel>Duration</FieldLabel>
          <InputField
            name="duration"
            value={formData.duration || ""}
            onChange={handleChange}
            placeholder="00:00"
          />
        </label>

        <label className="block">
          <FieldLabel>Order Index</FieldLabel>
          <InputField
            type="number"
            min="1"
            name="order"
            value={formData.order || ""}
            onChange={handleChange}
            placeholder="1"
          />
        </label>

        <label className="block lg:col-span-3">
          <FieldLabel>Description</FieldLabel>
           <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Describe what students will learn"
            className="min-h-[164px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base font-medium leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </label>
      </div>
    </section>
  );
}

export default LectureBasicsSection;
