using System.Text.Json;
using System.Text;

namespace TrialP.Products.Helpers
{
    public static class JsonHelper
    {
        public static string ToJsonString(this JsonDocument jdoc)
        {
            using (var stream = new MemoryStream())
            {
                Utf8JsonWriter writer = new Utf8JsonWriter(stream, new JsonWriterOptions { Indented = true });
                jdoc.WriteTo(writer);
                writer.Flush();
                return jdoc.RootElement.GetRawText();
            }
        }
    }
}
