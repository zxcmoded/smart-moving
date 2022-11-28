using NUnit.Framework;
using Should;
using SmartMoving.Core.Extensions;
using SpecsFor.StructureMap;

namespace SmartMoving.IntegrationSpecs.SmartMoving.Core.Extensions
{
    public class StringExtensionSpecs
    {
        public class WhenNormalizingAPhoneNumber : SpecsFor<object>
        {
            [Test]
            public void ThenItHandlesSimpleCasesCorrectly()
            {
                "(123) 456 7890".NormalizePhoneNumber().ShouldEqual("1234567890");
                "1234567890".NormalizePhoneNumber().ShouldEqual("1234567890");
                "123-456-7890".NormalizePhoneNumber().ShouldEqual("1234567890");
            }

            [Test]
            public void ThenItHandlesExtensions()
            {
                "(123) 456 7890 x 1234".NormalizePhoneNumber().ShouldEqual("1234567890 ext 1234");
                "1234567890 x1234".NormalizePhoneNumber().ShouldEqual("1234567890 ext 1234");
                "123-456-7890 ext1234".NormalizePhoneNumber().ShouldEqual("1234567890 ext 1234");
                "123-456-7890 ext 1234".NormalizePhoneNumber().ShouldEqual("1234567890 ext 1234");
                "1234567890 ext 123".NormalizePhoneNumber().ShouldEqual("1234567890 ext 123");
            }

            [Test]
            public void ThenItIgnoresThingsThatCannotBeParsed()
            {
                "(123) 456 789000 abc".NormalizePhoneNumber().ShouldEqual("(123) 456 789000 abc");
            }
        }

        public class WhenTrimmingNonAlphaNumeric : SpecsFor<object>
        {
            [Test]
            public void ThenItHandlesSimpleCasesCorrectly()
            {
                string test = null;
                test.TrimNonAlphaNumeric().ShouldBeNull();
                "   ".TrimNonAlphaNumeric().ShouldEqual("");
                "ABC Blarg ".TrimNonAlphaNumeric().ShouldEqual("ABC Blarg");
                "ABC Blarg -".TrimNonAlphaNumeric().ShouldEqual("ABC Blarg");
                "ABC Blarg - ".TrimNonAlphaNumeric().ShouldEqual("ABC Blarg");
                "ABC Blarg - blah".TrimNonAlphaNumeric().ShouldEqual("ABC Blarg blah");
                "ABC Blarg - blah1, blah".TrimNonAlphaNumeric().ShouldEqual("ABC Blarg blah1 blah");
                "ABC Blarg - blah1, blah. blah".TrimNonAlphaNumeric().ShouldEqual("ABC Blarg blah1 blah blah");
                "Some's Customer's Name-the 13th \"Big Dog\"".TrimNonAlphaNumeric().ShouldEqual("Somes Customers Namethe 13th Big Dog");
                "Some's Customer's Name-the 13th \"Big Dog\"".TrimNonAlphaNumeric().ShouldEqual("Somes Customers Namethe 13th Big Dog");
            }

            [Test]
            public void ThenAccentedCharactersAreRemoved()
            {
                "abcáíÍÓawefwaef".TrimNonAlphaNumeric().ShouldEqual("abcawefwaef");
            }
        }

        public class WhenCombiningItemsIntoASentence : SpecsFor<object>
        {
            [Test]
            public void ThenItReturnsEmptyForAnEmptyCollection()
            {
                new string[0].SentenceJoinNonNullEntries().ShouldEqual(string.Empty);
            }

            [Test]
            public void ThenItReturnsEmptyForACollectionOfEmptyValues()
            {
                new []
                {
                    string.Empty,
                    null,
                    string.Empty
                }.SentenceJoinNonNullEntries().ShouldEqual(string.Empty);
            }

            [Test]
            public void ThenItReturnsJustTheItemForASingleEntry()
            {
                new[] {"test"}.SentenceJoinNonNullEntries().ShouldEqual("test");
            }

            [Test]
            public void ThenItReturnsTheCorrectCombinedResultForTwoEntries()
            {
                new[]
                {
                    "test 1",
                    null,
                    "test 2"
                }.SentenceJoinNonNullEntries().ShouldEqual("test 1 and test 2");
            }

            [Test]
            public void ThenItWorksForMoreComplicatedCollections()
            {
                new[] {"A", string.Empty, "B", null, "C", "D", null}.SentenceJoinNonNullEntries()
                    .ShouldEqual("A, B, C, and D");
            }
        }

        public class WhenGettingFirstAndLastName : SpecsForAsync<object>
        {
            [TestCase(" John Smith", "John", "Smith"),
             TestCase(" John Smith ", "John", "Smith"),
             TestCase("John Smith ", "John", "Smith"),
             TestCase("John Smith", "John", "Smith"),
             TestCase("John Boy Smith", "John", "Smith"),
             TestCase("John Boy Guy Smith", "John", "Smith"),
             TestCase(" John ", "John", ""),
             TestCase("John", "John", "")]
            public void ThenItReturnsExpectedInputAndOutput(string input, string expectedFirstName, string expectedLastName)
            {
                input.SplitIntoFirstAndLastName().ShouldEqual((expectedFirstName, expectedLastName));

            }
        }

        public class WhenRemovingSuffixes : SpecsForAsync<object>
        {
            [TestCase(".whatever.com", ".whatever.com", ""),
             TestCase("blah.whatever.com", ".whatever.com", "blah"),
             TestCase("blah.whatever1.com", ".whatever.com", "blah.whatever1.com"),
             TestCase("", "blah.whatever1.com", "")]
            public void ThenItReturnsExpectedInputAndOutput(string input, string suffix, string expectedResult)
            {
                input.RemoveSuffix(suffix).ShouldEqual(expectedResult);
            }
        }
    }
}
