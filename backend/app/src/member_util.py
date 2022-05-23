from typing import List

from app.dto.response import MemberDTO
from app.models.team import Member
from app.serializers.team import MemberSerializer


def get_member_report(team_id) -> List[MemberDTO]:
    members = Member.objects.filter(team_id=team_id)
    serializer = MemberSerializer(members, many=True)
    return [MemberDTO(**m) for m in serializer.data]
