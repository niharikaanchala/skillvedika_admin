import MultiSectionCmsEditor from "@/components/admin/MultiSectionCmsEditor";

export default function AdminCareerServicePage() {
  return (
    <MultiSectionCmsEditor
      title="Career Service Page"
      subtitle="Manage all Career Services page sections dynamically."
      sections={[
        {
          key: "seo",
          title: "SEO Section",
          endpoint: "/api/career/meta-tags/",
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
          endpoint: "/api/career/hero/",
          mode: "singleton",
          fields: [
            { key: "title", label: "Title", required: true },
            { key: "subtitle", label: "Subtitle", type: "textarea", required: true },
            { key: "primary_button_text", label: "Primary Button Text", required: true },
            { key: "primary_button_link", label: "Primary Button Link", type: "url" },
            { key: "secondary_button_text", label: "Secondary Button Text", required: true },
            { key: "secondary_button_link", label: "Secondary Button Link", type: "url" },
          ],
        },
        {
          key: "services_heading",
          title: "Services Section Heading",
          endpoint: "/api/career/services-heading/",
          mode: "singleton",
          fields: [{ key: "title", label: "Services Heading", required: true }],
        },
        {
          key: "services",
          title: "Career Services Cards",
          endpoint: "/api/career/services/",
          mode: "list",
          fields: [
            { key: "title", label: "Title", required: true },
            { key: "description", label: "Description", type: "textarea", required: true },
            { key: "icon", label: "Icon" },
          ],
        },
        {
          key: "support",
          title: "Career Support Section",
          endpoint: "/api/career/support/",
          mode: "singleton",
          fields: [
            { key: "title", label: "Title", required: true },
            { key: "description", label: "Description", type: "textarea", required: true },
          ],
        },
        {
          key: "cta",
          title: "CTA Section",
          endpoint: "/api/career/cta/",
          mode: "singleton",
          fields: [
            { key: "title", label: "Title", required: true },
            { key: "subtitle", label: "Subtitle", type: "textarea" },
            { key: "button_text", label: "Button Text", required: true },
            { key: "button_link", label: "Button Link", type: "url" },
          ],
        },
        {
          key: "faqs",
          title: "FAQ Items",
          endpoint: "/api/career/faqs/",
          mode: "list",
          fields: [
            { key: "question", label: "Question", required: true },
            { key: "answer", label: "Answer", type: "textarea", required: true },
          ],
        },
      ]}
    />
  );
}
