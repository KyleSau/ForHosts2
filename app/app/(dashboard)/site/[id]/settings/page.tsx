import prisma from "@/lib/prisma";
import Form from "@/components/form";
import { updateSite } from "@/lib/actions";
import DeleteSiteForm from "@/components/form/delete-site-form";

export default async function SiteSettingsIndex({
  params,
}: {
  params: { id: string };
}) {
  const data = await prisma.site.findUnique({
    where: {
      id: params.id,
    },
  });

  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Name"
        description="The name of your site. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: data?.name!,
          placeholder: "My Awesome Website",
          maxLength: 32,
        }}
        handleSubmit={updateSite}
      />

      <Form
        title="Description"
        description="The description of your site. This will be used as the meta description on Google as well."
        helpText="Include SEO-optimized keywords that you want to rank for."
        inputAttrs={{
          name: "description",
          type: "text",
          defaultValue: data?.description!,
          placeholder: "A blog about really interesting things.",
        }}
        handleSubmit={updateSite}
      />

      <Form
        title="Tawk.to ID"
        description="Input The Tawk.to ID if you would like to offer live chat support for your website. "
        helpText="To find your widget and property IDs, log in to your tawk.to account. Then make your way to Administration ➞ Channels ➞ Chat Widget. Copy the 'Direct Chat Link' and paste it into the input below."
        inputAttrs={{
          name: "description",
          type: "text",
          defaultValue: data?.description!,
          placeholder: "https://tawk.to/chat/xxxxxxxxxxxxxxxxxxxxxxxx/123456789",
        }}
        handleSubmit={updateSite}
      />

      <DeleteSiteForm siteName={data?.name!} />
    </div>
  );
}
