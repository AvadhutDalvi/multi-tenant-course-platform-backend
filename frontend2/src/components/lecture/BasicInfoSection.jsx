function FieldLabel({ children }) {
  return (
    <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A2B8]">
      {children}
    </span>
  );
}

function BaseInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`h-14 w-full rounded-[20px] border border-[#ECEEFA] bg-[#F9FAFF] px-5 text-[15px] text-[#111827] outline-none transition placeholder:text-[#B3BDD1] focus:border-[#6E59F7] focus:bg-white focus:ring-4 focus:ring-[#EEEAFF] ${className}`}
    />
  );
}

function BaseSelect({ className = "", children, ...props }) {
  return (
    <select
      {...props}
      className={`h-14 w-full appearance-none rounded-[20px] border border-[#ECEEFA] bg-[#F9FAFF] px-5 text-[15px] text-[#111827] outline-none transition focus:border-[#6E59F7] focus:bg-white focus:ring-4 focus:ring-[#EEEAFF] ${className}`}
    >
      {children}
    </select>
  );
}

function BasicInfoSection({ formData, onFieldChange }) {
  return (
    <section className="rounded-[30px] bg-white px-6 py-6 shadow-[0_10px_32px_rgba(17,24,39,0.04)] ring-1 ring-[#F0F2F7] sm:px-7 sm:py-7">
      <div className="mb-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#A3ACC1]">
          Lecture Details
        </p>
        <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#111827]">
          Basic Information
        </h2>
      </div>

      <div className="space-y-6">
        <label className="block">
          <FieldLabel>Lecture Title</FieldLabel>
          <BaseInput
            type="text"
            name="title"
            value={formData.title}
            onChange={onFieldChange}
            placeholder="Enter lecture title"
          />
        </label>

        <label className="block">
          <FieldLabel>Description</FieldLabel>
          <textarea
            name="description"
            value={formData.description}
            onChange={onFieldChange}
            placeholder="Write a short description for this lecture"
            className="h-36 w-full resize-none rounded-[22px] border border-[#ECEEFA] bg-[#F9FAFF] px-5 py-4 text-[15px] text-[#111827] outline-none transition placeholder:text-[#B3BDD1] focus:border-[#6E59F7] focus:bg-white focus:ring-4 focus:ring-[#EEEAFF]"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-3">
          <label className="block">
            <FieldLabel>Module</FieldLabel>
            <BaseInput
              type="text"
              name="module"
              value={formData.module}
              onChange={onFieldChange}
              placeholder="Module 01"
            />
          </label>

          <label className="block">
            <FieldLabel>Order</FieldLabel>
            <BaseInput
              type="number"
              min="1"
              name="order"
              value={formData.order}
              onChange={onFieldChange}
              placeholder="01"
            />
          </label>

          <label className="block">
            <FieldLabel>Status</FieldLabel>
            <div className="relative">
              <BaseSelect name="status" value={formData.status} onChange={onFieldChange}>
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
              </BaseSelect>
              <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-[#98A2B8]">
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}

export default BasicInfoSection;
