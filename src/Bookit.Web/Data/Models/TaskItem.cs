namespace Bookit.Web.Data.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int StoryId { get; set; }
        public Story Story { get; set; }
    }
}
