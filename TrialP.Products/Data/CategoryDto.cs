namespace TrialP.Products.Data
{
    public class CategoryDto
    {
        public class MainDto
        {
            public string MainName { get; set; }
            public class SubDto
            {
                public string Name { get; set; }
                public class SubsubDto
                {
                    public string Name { get; set; }
                    public string ApiCategory { get; set; }
                }

                public List<SubsubDto> Subsubs { get; set; }
            }
            public List<SubDto> Subs { get; set; }
        }

        public MainDto Main { get; set; }  
    }
}
