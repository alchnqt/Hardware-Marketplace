namespace TrialP.Products.Data
{
    public class CategoryDto
    {
        public class MainDto
        {
            public string MainName { get; set; }
            public class SubDto
            {
                public string SubsName { get; set; }
                public string ImageUrl { get; set; }
                public class SubsubDto
                {
                    public string Name { get; set; }
                    public string ApiCategory { get; set; }
                }

                public List<SubsubDto> Subssubs { get; set; }
            }
            public List<SubDto> Subs { get; set; }
        }
        public List<MainDto> Main { get; set; }  
    }
}
