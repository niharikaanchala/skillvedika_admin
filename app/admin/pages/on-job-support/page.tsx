import MultiSectionCmsEditor from "@/components/admin/MultiSectionCmsEditor";

const iconOptions = [
  { label: "No icon", value: "" },
  { label: "💻 Laptop", value: "💻" },
  { label: "🧑‍💻 Developer", value: "🧑‍💻" },
  { label: "⚡ Fast", value: "⚡" },
  { label: "📈 Growth", value: "📈" },
  { label: "🎯 Target", value: "🎯" },
  { label: "🛠 Tools", value: "🛠" },
  { label: "📊 Analytics", value: "📊" },
  { label: "🔧 Support", value: "🔧" },
];

export default function AdminOnJobSupportPage() {
  return (
    <MultiSectionCmsEditor
      title="On Job Support Page"
      subtitle="Manage all On Job Support page sections dynamically."
      sections={[
        {
          key: "seo",
          title: "SEO Section",
          endpoint: "/api/on-job-support/meta-tags/",
          mode: "singleton",
          fields: [
            { key: "meta_title", label: "Meta Title", required: true },
            { key: "meta_description", label: "Meta Description", type: "textarea", required: true },
            { key: "meta_keywords", label: "Meta Keywords (comma-separated)", required: true },
          ],
        },
        {
          key: "hero",
          title: "Hero Section",
          endpoint: "/api/on-job-support/hero/",
          mode: "singleton",
          fields: [
            { key: "title", label: "Title", required: true },
            { key: "subtitle", label: "Subtitle", type: "textarea", required: true },
            { key: "button_text", label: "Button Text", required: true },
            { key: "button_link", label: "Button Link", type: "url" },
            { key: "image", label: "Hero Image", type: "file" },
          ],
        },
        {
          key: "realtime-help",
          title: "Real-Time Help Section",
          endpoint: "/api/on-job-support/realtime-help/",
          mode: "singleton",
          fields: [
            { key: "title_main", label: "Title Main", required: true },
            { key: "title_sub", label: "Title Sub", required: true },
            { key: "description", label: "Description", type: "textarea", required: true },
            { key: "icon_1_title", label: "Icon 1 Title" },
            { key: "icon_1_desc", label: "Icon 1 Description" },
            { key: "icon_2_title", label: "Icon 2 Title" },
            { key: "icon_2_desc", label: "Icon 2 Description" },
            { key: "image", label: "Section Image", type: "file" },
          ],
        },
        {
          key: "section-content",
          title: "Who Is This For - Section Content",
          endpoint: "/api/on-job-support/section-content/",
          mode: "singleton",
          fields: [
            { key: "audience_eyebrow", label: "Eyebrow (small title)", required: true, placeholder: "e.g. TARGET AUDIENCE" },
            { key: "audience_title", label: "Section Heading", required: true, placeholder: "e.g. Who Is This For?" },
            { key: "audience_description", label: "Section Description", type: "textarea", required: true },
            { key: "help_title", label: "How We Help - Title" },
            { key: "process_title", label: "Our Process - Title" },
          ],
        },
        {
          key: "audience",
          title: "Who Is This For - Cards",
          endpoint: "/api/on-job-support/audience/",
          mode: "list",
          fields: [
            { key: "tag", label: "Card Tag", required: true, placeholder: "e.g. TECHNICAL EXPERTS" },
            { key: "title", label: "Card Title", required: true, placeholder: "e.g. Software Professionals" },
            { key: "desc", label: "Card Description", type: "textarea", required: true },
          ],
        },
        {
          key: "help",
          title: "How We Help Cards",
          endpoint: "/api/on-job-support/help/",
          mode: "list",
          fields: [
            { key: "icon", label: "Icon", type: "select", options: iconOptions },
            { key: "title", label: "Title", required: true },
            { key: "desc", label: "Description", type: "textarea", required: true },
          ],
        },
        {
          key: "steps",
          title: "Process Steps",
          endpoint: "/api/on-job-support/steps/",
          mode: "list",
          fields: [
            { key: "order", label: "Order", type: "number", required: true },
            { key: "desc", label: "Step Description", type: "textarea", required: true },
          ],
        },
        {
          key: "why-choose",
          title: "Why Choose Section",
          endpoint: "/api/on-job-support/why-choose/",
          mode: "singleton",
          fields: [
            { key: "title", label: "Title", required: true },
            { key: "subtitle", label: "Subtitle" },
            { key: "points", label: "Points", type: "string_list" },
            { key: "image", label: "Image", type: "file" },
          ],
        },
        {
          key: "demo",
          title: "Demo Section",
          endpoint: "/api/on-job-support/demo/",
          mode: "singleton",
          fields: [
            { key: "badge", label: "Badge" },
            { key: "title_main", label: "Title Main", required: true },
            { key: "title_highlight", label: "Title Highlight", required: true },
            { key: "description", label: "Description", type: "textarea" },
            { key: "features", label: "Features", type: "feature_list" },
          ],
        },
      ]}
    />
  );
}
